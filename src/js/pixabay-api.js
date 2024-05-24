// js/pixabay-api.js

import axios from 'axios';

const API_KEY = '43843961-af0153872675268c29353c689';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page = 1, perPage = 15) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });
  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
