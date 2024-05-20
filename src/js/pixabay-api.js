// js/pixabay-api.js

const API_KEY = '43843961-af0153872675268c29353c689';
const BASE_URL = 'https://pixabay.com/api/';

export function fetchImages(searchQuery) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Error fetching data');
    })
    .then(data => {
      if (data.hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again!'
        );
      }
      return data.hits;
    });
}
