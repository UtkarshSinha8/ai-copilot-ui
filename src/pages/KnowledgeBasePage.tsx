import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Document } from '../types/document.types';
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from '../services/document.service';
import StatsCards from '../components/knowledgebase/StatsCards';
import SearchBar from '../components/knowledgebase/SearchBar';
import UploadZone from "../components/knowledgebase/UploadZone";
import type { UploadState } from "../types/document.types";
import DocumentList from '../components/knowledgebase/DocumentList';
import DeleteDialog from '../components/knowledgebase/DeleteDialog';
import DocumentDrawer from '../components/knowledgebase/DocumentDrawer';

const KnowledgeBasePage: React.FC = () => {
  // Document list state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Delete state
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drawer state
  const [drawerDoc, setDrawerDoc] = useState<Document | null>(null);

  // ─── Fetch ───────────────────────────────────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err: any) {
      setFetchError(err?.response?.data?.message ?? 'Failed to fetch documents.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ─── Search filter ────────────────────────────────────────────────────────
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((d) => d.name.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  // ─── Upload ───────────────────────────────────────────────────────────────
  const handleFileSelect = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setUploadState('uploading');

    try {
      await uploadDocument(file, (pct) => {
        setUploadProgress(pct);
        if (pct === 100) setUploadState('processing');
      });
      setUploadState('success');
      await fetchDocuments();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Upload failed. Please try again.';
      setUploadError(msg);
      setUploadState('error');
    } finally {
      setIsUploading(false);
      // Reset after 3 s
      setTimeout(() => {
        setUploadState('idle');
        setUploadProgress(0);
        setUploadError(null);
      }, 3000);
    }
  }, [fetchDocuments]);

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDocument(docToDelete.id);
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setDocToDelete(null);
    } catch (err: any) {
      // keep dialog open, show nothing extra — user can retry
    } finally {
      setIsDeleting(false);
    }
  }, [docToDelete]);

  // ─── Scroll lock when drawer open ────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerDoc ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerDoc]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Knowledge Base</h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Manage documents used by the RAG system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDocuments}
              disabled={isLoading}
              className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:opacity-50"
            >
              <svg
                className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => document.getElementById('upload-zone-trigger')?.click()}
              className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white transition hover:bg-zinc-800"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Document
            </button>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && !fetchError && (
          <StatsCards documents={documents} />
        )}

        {/* Upload zone */}
        <UploadZone
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadState={uploadState}
          uploadError={uploadError}
        />

        {/* Document list panel */}
        <div className="rounded border border-zinc-800 bg-zinc-950">
          {/* Panel header */}
          <div className="border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Documents</p>
              {!isLoading && !fetchError && (
                <p className="text-xs text-zinc-500">{documents.length} total</p>
              )}
            </div>
          </div>

          {/* Search */}
          {!isLoading && !fetchError && documents.length > 0 && (
            <div className="border-b border-zinc-800 px-4 py-3">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultCount={filteredDocuments.length}
                totalCount={documents.length}
              />
            </div>
          )}

          {/* List */}
          <DocumentList
            documents={filteredDocuments}
            isLoading={isLoading}
            error={fetchError}
            searchQuery={searchQuery}
            onViewDetails={setDrawerDoc}
            onDelete={setDocToDelete}
            onUploadClick={() => {}}
            onRetry={fetchDocuments}
          />
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {docToDelete && (
        <DeleteDialog
          documentName={docToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDocToDelete(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Detail drawer */}
      <DocumentDrawer
        document={drawerDoc}
        onClose={() => setDrawerDoc(null)}
      />
    </div>
  );
};

export default KnowledgeBasePage;