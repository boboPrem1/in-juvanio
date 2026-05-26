// src/api/data.api.js
import apiClient from './client';

export async function getData(slug, lang) {
  const { data } = await apiClient.get(`/portfolio/${slug}/data/${lang}`);
  return data;
}

export async function patchDataSection(slug, lang, section, payload) {
  const { data } = await apiClient.patch(
    `/studio/${slug}/data/${lang}/${section}`,
    payload
  );
  return data;
}
