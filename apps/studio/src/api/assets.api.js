// src/api/assets.api.js
import apiClient from './client';

/**
 * Demande une URL pré-signée S3 au backend.
 * @returns {{ uploadUrl: string, cdnUrl: string }}
 */
export async function getPresignedUrl(slug, { filename, contentType, assetKey }) {
  const { data } = await apiClient.post(`/studio/${slug}/assets/presign`, {
    filename,
    contentType,
    assetKey,
  });
  return data;
}

/**
 * Upload direct vers S3 via l'URL pré-signée (bypass du serveur).
 */
export async function uploadToS3(uploadUrl, file) {
  await fetch(uploadUrl, {
    method:  'PUT',
    body:    file,
    headers: { 'Content-Type': file.type },
  });
}
