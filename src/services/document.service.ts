import api from './api';
import type { Document, UploadResponse } from '../types/document.types';

export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get("/documents");

  return response.data.data.map((doc: any) => ({
    id: doc.id,
    name: doc.originalName,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    uploadDate: doc.createdAt,
    status: doc.status === "completed" ? "indexed" : doc.status,
    chunks: doc.chunkCount,
    url: doc.filePath,
  }));
};

export const uploadDocument = async (
  file: File,
  onUploadProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onUploadProgress(percent);
      }
    },
  });

  return response.data;
};

export const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/documents/${id}`);
};