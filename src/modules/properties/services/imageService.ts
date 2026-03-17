import apiClient from "@/api/client";
import {
  PropertyImage,
  UploadImageResponse,
  BulkUploadImagesResponse,
} from "../types/property.types";

class ImageService {
  async uploadImage(propertyId: string, file: File, caption?: string): Promise<PropertyImage> {
    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);

    const { data } = await apiClient.post<UploadImageResponse>(
      `/properties/${propertyId}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.image;
  }

  async uploadMultipleImages(propertyId: string, files: File[]): Promise<PropertyImage[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const { data } = await apiClient.post<BulkUploadImagesResponse>(
      `/properties/${propertyId}/images/bulk`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.images;
  }

  async deleteImage(propertyId: string, imageId: string): Promise<void> {
    await apiClient.delete(`/properties/${propertyId}/images/${imageId}`);
  }

  async updateImageOrder(propertyId: string, imageId: string, order: number): Promise<PropertyImage> {
    const { data } = await apiClient.patch<{ image: PropertyImage }>(
      `/properties/${propertyId}/images/${imageId}`,
      { order },
    );
    return data.image;
  }

  async setPrimaryImage(propertyId: string, imageId: string): Promise<void> {
    await apiClient.post(`/properties/${propertyId}/images/${imageId}/set-primary`);
  }

  async updateImageCaption(propertyId: string, imageId: string, caption: string): Promise<PropertyImage> {
    const { data } = await apiClient.patch<{ image: PropertyImage }>(
      `/properties/${propertyId}/images/${imageId}`,
      { caption },
    );
    return data.image;
  }
}

export const imageService = new ImageService();
