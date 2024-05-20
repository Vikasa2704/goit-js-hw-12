// main.js

import { fetchImages } from './js/pixabay-api.js';
import {
  createMarkup,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/styles.css';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const gallery = document.querySelector('.gallery');
  const loaderContainer = document.querySelector('.loader-container');

  // Приховуємо лоадер через секунду після завантаження сторінки
  setTimeout(() => {
    hideLoader(loaderContainer);
  }, 1000);

  form.addEventListener('submit', onSearch);

  function onSearch(event) {
    event.preventDefault();
    const searchQuery = input.value.trim();

    clearGallery();
    showLoader(loaderContainer);

    if (searchQuery === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query!',
      });
      input.value = ''; // Очищення поля вводу форми при некоректному вводу
      hideLoader(loaderContainer); // Приховуємо індикатор завантаження при некоректному вводу
      return;
    }

    fetchImages(searchQuery)
      .then(images => {
        const markup = createMarkup(images);
        gallery.insertAdjacentHTML('beforeend', markup);

        // Оновлення SimpleLightbox після додавання нових зображень
        const lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
        lightbox.refresh();

        input.value = ''; // Очищення поля вводу форми після успішного пошуку
      })
      .catch(error => {
        iziToast.error({
          title: 'Error',
          message: error.message,
        });

        input.value = ''; // Очищення поля вводу форми при помилці
      })
      .finally(() => hideLoader(loaderContainer));
  }
});
