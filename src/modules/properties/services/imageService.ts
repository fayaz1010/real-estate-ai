// FILE PATH: src/modules/properties/services/imageService.ts
// Module 1.2: Property Listings Management - Image Service

import { tokenManager } from "../../auth/utils/tokenManager";
import {
  PropertyImage,
  UploadImageResponse,
  BulkUploadImagesResponse,
} from "../types/property.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4041/api";

class ImageService {
  /**
   * Upload single image
   */
  async uploadImage(
    propertyId: string,
    file: File,
    caption?: string,
  ): Promise<PropertyImage> {
    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);

    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/images`,
      {
        method: "POST",
        headers: tokenManager.getAuthHeader(),
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data: UploadImageResponse = await response.json();
    return data.image;
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    propertyId: string,
    files: File[],
  ): Promise<PropertyImage[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/images/bulk`,
      {
        method: "POST",
        headers: tokenManager.getAuthHeader(),
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload images");
    }

    const data: BulkUploadImagesResponse = await response.json();
    return data.images;
  }

  /**
   * Delete image
   */
  async deleteImage(propertyId: string, imageId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: tokenManager.getAuthHeader(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
  }

  /**
   * Update image order
   */
  async updateImageOrder(
    propertyId: string,
    imageId: string,
    order: number,
  ): Promise<PropertyImage> {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/images/${imageId}`,
      {
        method: "PATCH",
        headers: {
          ...tokenManager.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update image order");
    }

    const data = await response.json();
    return data.image;
  }

  /**
   * Set primary image
   */
  async setPrimaryImage(propertyId: string, imageId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/images/${imageId}/set-primary`,
      {
        method: "POST",
        headers: tokenManager.getAuthHeader(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to set primary image");
    }
  }

  /**
   * Update image caption
   */
  async updateImageCaption(
    propertyId: string,
    imageId: string,
    caption: string,
  ): Promise<PropertyImage> {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/images/${imageId}`,
      {
        method: "PATCH",
        headers: {
          ...tokenManager.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update caption");
    }

    const data = await response.json();
    return data.image;
  }
}

export const imageService = new ImageService();
