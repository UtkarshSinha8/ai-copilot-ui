export type DocumentStatus = "processing" | "indexed" | "failed";

/**
 * Frontend upload lifecycle.
 * This is different from DocumentStatus returned by the backend.
 */
export type UploadState =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export interface Document {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: DocumentStatus;

  chunks?: number;
  embeddingStatus?: string;
  mimeType?: string;
  url?: string;
}

export interface UploadResponse {
  id: string;
  name: string;
  status: DocumentStatus;
  message?: string;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
}