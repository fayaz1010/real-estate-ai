// Property Image Upload Routes
import os from "os";
import path from "path";

import { Router, Request, Response } from "express";
import multer from "multer";

import prisma from "../../config/database";
import { config } from "../../config/env";
import { authenticate } from "../../middleware/auth";
import { asyncHandler } from "../../middleware/errorHandler";
import { AppError } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";
import { propertyStorage } from "../storage/cloud-storage.service";

// Multer configuration - use temp directory (files are moved to cloud storage after upload)
const tempUploadDir = path.join(os.tmpdir(), "realestate-uploads");
import fs from "fs";
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

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

    // Upload to cloud storage (placeholder)
    const cloudKey = `${propertyId}/${req.file.filename}`;
    const uploadResult = await propertyStorage.upload(
      req.file.path,
      cloudKey,
      req.file.mimetype,
    );

    // Clean up temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

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

    return successResponse(res, { image }, "Image uploaded to cloud storage", 201);
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

    // Upload all files to cloud storage
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const cloudKey = `${propertyId}/${file.filename}`;
        const result = await propertyStorage.upload(file.path, cloudKey, file.mimetype);
        // Clean up temp file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return result;
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
      `${images.length} images uploaded to cloud storage`,
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

    // Delete file from cloud storage
    const cloudKey = image.url.replace(/^\/cloud\/property-images\//, "");
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
