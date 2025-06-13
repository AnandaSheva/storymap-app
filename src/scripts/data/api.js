import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  STORIES: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORE_NEW_STORY: `${BASE_URL}/stories`,
};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories() {
  const accessToken = getAccessToken();

  const response = await fetch(`${ENDPOINTS.STORIES}?location=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}

export async function getStoryById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewStory({ description, photo, latitude, longitude }) {
  const accessToken = getAccessToken();

  // Konversi Blob ke File jika diperlukan
  if (photo instanceof Blob && !(photo instanceof File)) {
    photo = new File([photo], 'photo.jpg', { type: photo.type || 'image/jpeg' });
  }

  // Validasi ukuran maksimal 1MB
  if (photo.size > 1024 * 1024) {
    return {
      ok: false,
      message: 'Ukuran foto maksimal 1MB',
    };
  }

  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('description', description);

  if (latitude != null && longitude != null) {
    formData.append('lat', latitude);
    formData.append('lon', longitude);
  }

  try {
    const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message || 'Terjadi kesalahan jaringan',
    };
  }
}
export default {
  getRegistered,
  getLogin,
  getAllStories,
  getStoryById,
  storeNewStory,
};