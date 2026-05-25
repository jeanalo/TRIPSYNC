import type { UnsplashImage } from '@/types/admin.types';

interface UnsplashApiResult {
  id: string;
  urls: { regular: string; thumb: string };
  alt_description: string | null;
}

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com/search/photos';

const MOCK_IMAGES: UnsplashImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Eiffel Tower',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=200',
    alt_description: 'London Bridge',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Venice Canal',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Clock Tower',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Tokyo City',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Yosemite Valley',
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Mountain Lake',
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80',
    thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=200',
    alt_description: 'Boat on Lake',
  },
];

export async function searchUnsplashImages(query: string): Promise<UnsplashImage[]> {
  if (!ACCESS_KEY || ACCESS_KEY === '') {
    console.warn('Unsplash Access Key missing. Returning mock data.');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_IMAGES.filter(img => 
          img.alt_description.toLowerCase().includes(query.toLowerCase())
        ).concat(MOCK_IMAGES).slice(0, 8));
      }, 500);
    });
  }

  try {
    const response = await fetch(`${BASE_URL}?query=${query}&per_page=8`, {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const data = await response.json();
    
    return data.results.map((img: UnsplashApiResult) => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.thumb,
      alt_description: img.alt_description || 'Unsplash image',
    }));
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return MOCK_IMAGES;
  }
}
