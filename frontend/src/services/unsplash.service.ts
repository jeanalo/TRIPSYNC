import type { UnsplashImage } from '@/types/admin.types';

interface UnsplashApiResult {
  id: string;
  urls: { regular: string; thumb: string };
  alt_description: string | null;
}

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com/search/photos';

export async function searchUnsplashImages(query: string): Promise<UnsplashImage[]> {
  if (!ACCESS_KEY) {
    console.warn('VITE_UNSPLASH_ACCESS_KEY is not set.');
    return [];
  }

  const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&per_page=8`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Unsplash request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results.map((img: UnsplashApiResult) => ({
    id: img.id,
    url: img.urls.regular,
    thumb: img.urls.thumb,
    alt_description: img.alt_description || 'Unsplash image',
  }));
}
