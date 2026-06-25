export interface RagAskRequest {
  question: string;
}

export interface RagAskResponse {
  success: boolean;
  statusCode: number;
  data: {
    question: string;
    answer: string;
    sources?: RagSource[];
    chunks?: RagChunk[];
    context?: string;
  };
}

export interface RagSource {
  id?: string;
  filename?: string;
  title?: string;
  score?: number;
  url?: string;
}

export interface RagChunk {
  id?: string;
  content: string;
  filename?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface RagConversationEntry {
  id: string;
  question: string;
  answer: string;
  sources?: RagSource[];
  chunks?: RagChunk[];
  context?: string;
  timestamp: Date;
  error?: boolean;
}

export interface RagSearchRequest {
  query: string;
  limit?: number;
}

export interface RagSearchResponse {
  success: boolean;
  statusCode: number;
  data: {
    results: RagChunk[];
  };
}