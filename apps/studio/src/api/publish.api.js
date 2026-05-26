// src/api/publish.api.js
import apiClient from './client';

/**
 * Publie le skin actuel :
 * snapshot → UPDATE is_published → webhook → build queue.
 * @returns {{ publishedAt: string, historyId: string, buildId: string }}
 */
export async function publishSkin(slug) {
  const { data } = await apiClient.post(`/studio/${slug}/publish`);
  return data;
}
