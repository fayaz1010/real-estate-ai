// Property Image Upload Routes
import { Router, Request, Response } from "express";
import multer from "multer";

import prisma from "../../config/database";
import { config } from "../../config/env";
import { authenticate } from "../../middleware/auth";
import { asyncHandler } from "../../middleware/errorHandler";
import { AppError } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";
import { propertyStorage } from "../storage/cloud-storage.service";

// Multer configuration - use memory storage (buffers go directly to R2)
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxFileSize },
});

function generateFileKey(
  propertyId: string,
  file: Express.Multer.File,
): string {
  const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${propertyId}/${uniqueSuffix}${ext}`;
}

const router = Router();

// POST /api/properties/:propertyId/images - Upload single image
router.post(
  "/:propertyId/images",
  authenticate,
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user!.userId;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: userId },
    });
    if (!property)
      throw new AppError("Property not found or access denied", 404);

    if (!req.file) throw new AppError("No image file provided", 400);

    // Upload to Cloudflare R2
    const cloudKey = generateFileKey(propertyId, req.file);
    const uploadResult = await propertyStorage.uploadBuffer(
      req.file.buffer,
      cloudKey,
      req.file.mimetype,
    );

    const imageCount = await prisma.propertyImage.count({
      where: { propertyId },
    });

    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        url: uploadResult.file.url,
        caption: req.body.caption || null,
        order: imageCount,
        isPrimary: imageCount === 0,
      },
    });

    return successResponse(res, { image }, "Image uploaded successfully", 201);
  }),
);

// POST /api/properties/:propertyId/images/bulk - Upload multiple images
router.post(
  "/:propertyId/images/bulk",
  authenticate,
  upload.array("images", 20),
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const userId = req.user!.userId;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: userId },
    });
    if (!property)
      throw new AppError("Property not found or access denied", 404);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      throw new AppError("No image files provided", 400);

    const existingCount = await prisma.propertyImage.count({
      where: { propertyId },
    });

    // Upload all files to Cloudflare R2
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const cloudKey = generateFileKey(propertyId, file);
        return propertyStorage.uploadBuffer(
          file.buffer,
          cloudKey,
          file.mimetype,
        );
      }),
    );

    const images = await Promise.all(
      uploadResults.map((result, index) =>
        prisma.propertyImage.create({
          data: {
            propertyId,
            url: result.file.url,
            order: existingCount + index,
            isPrimary: existingCount === 0 && index === 0,
          },
        }),
      ),
    );

    return successResponse(
      res,
      { images },
      `${images.length} images uploaded successfully`,
      201,
    );
  }),
);

// DELETE /api/properties/:propertyId/images/:imageId
router.delete(
  "/:propertyId/images/:imageId",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId, imageId } = req.params;
    const userId = req.user!.userId;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: userId },
    });
    if (!property)
      throw new AppError("Property not found or access denied", 404);

    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId },
    });
    if (!image) throw new AppError("Image not found", 404);

    // Extract the R2 key from the full URL
    const urlParts = image.url.split(".com/");
    const keyWithBucket = urlParts.length > 1 ? urlParts[1] : image.url;
    // Remove bucket name prefix if present
    const bucketName =
      process.env.CLOUDFLARE_BUCKET_NAME || "real-estate-ai-images";
    const cloudKey = keyWithBucket.startsWith(bucketName + "/")
      ? keyWithBucket.substring(bucketName.length + 1)
      : keyWithBucket;

    await propertyStorage.delete(cloudKey);
    await prisma.propertyImage.delete({ where: { id: imageId } });

    return successResponse(res, null, "Image deleted");
  }),
);

// PATCH /api/properties/:propertyId/images/:imageId - Update image order/caption
router.patch(
  "/:propertyId/images/:imageId",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId, imageId } = req.params;
    const userId = req.user!.userId;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: userId },
    });
    if (!property)
      throw new AppError("Property not found or access denied", 404);

    const updateData: Record<string, unknown> = {};
    if (req.body.order !== undefined) updateData.order = req.body.order;
    if (req.body.caption !== undefined) updateData.caption = req.body.caption;

    const image = await prisma.propertyImage.update({
      where: { id: imageId },
      data: updateData,
    });

    return successResponse(res, { image }, "Image updated");
  }),
);

// POST /api/properties/:propertyId/images/:imageId/set-primary
router.post(
  "/:propertyId/images/:imageId/set-primary",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId, imageId } = req.params;
    const userId = req.user!.userId;

    const property = await prisma.property.findFirst({
      where: { id: propertyId, ownerId: userId },
    });
    if (!property)
      throw new AppError("Property not found or access denied", 404);

    // Unset all primary images for this property
    await prisma.propertyImage.updateMany({
      where: { propertyId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set the new primary
    const image = await prisma.propertyImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    return successResponse(res, { image }, "Primary image updated");
  }),
);

export default router;
