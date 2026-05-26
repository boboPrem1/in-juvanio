// src/api/skin.api.js
import apiClient from './client';

export async function getSkin(slug) {
  const { data } = await apiClient.get(`/studio/${slug}/skin`);
  return data;
}

export async function patchSkin(slug, patch) {
  const { data } = await apiClient.patch(`/studio/${slug}/skin`, patch);
  return data;
}

export async function getSkinHistory(slug) {
  const { data } = await apiClient.get(`/studio/${slug}/skin/history`);
  return data;
}

export async function rollbackSkin(slug, historyId) {
  const { data } = await apiClient.post(`/studio/${slug}/skin/rollback/${historyId}`);
  return data;
}

export async function getSkinTemplates() {
  const { data } = await apiClient.get('/skins/templates');
  return data;
}

export async function cloneSkin(slug, templateSkinId) {
  const { data } = await apiClient.post(`/studio/${slug}/skin/clone`, { sourceSkinId: templateSkinId });
  return data;
}
