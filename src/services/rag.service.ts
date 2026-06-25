import api from './api';
import type {
  RagAskRequest,
  RagAskResponse,
  RagSearchRequest,
  RagSearchResponse,
} from '../types/rag.types';

export const askQuestion = async (request: RagAskRequest): Promise<RagAskResponse> => {
  const response = await api.post<RagAskResponse>('/documents/ask', request);
  return response.data;
};

export const searchDocuments = async (
  request: RagSearchRequest
): Promise<RagSearchResponse> => {
  const response = await api.post<RagSearchResponse>('/documents/search', request);
  return response.data;
};