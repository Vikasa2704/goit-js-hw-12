// main.js

import { fetchImages } from './js/pixabay-api.js';
import {
  createMarkup,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  showLoadingIndicatorBtn,
  hideLoadingIndicatorBtn,
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
  const loadMoreBtn = document.querySelector('.load-more');
  const loaderBtn = document.querySelector('.loader-btn');

  // Приховуємо лоадер через секунду після завантаження сторінки
  setTimeout(() => {
    hideLoader(loaderContainer);
  }, 1000);

  let searchQuery = '';
  let page = 1;
  let totalHits = 0;

  form.addEventListener('submit', onSearch);
  loadMoreBtn.addEventListener('click', onLoadMore);

  function onSearch(event) {
    event.preventDefault();
    searchQuery = input.value.trim();

    if (searchQuery === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query!',
      });
      input.value = ''; // Очищення поля вводу форми при некоректному вводу
      hideLoader(loaderContainer); // Приховуємо індикатор завантаження при некоректному вводу
      return;
    }

    clearGallery();
    showLoader(loaderContainer);
    hideLoadMoreBtn(loadMoreBtn); // Приховуємо кнопку "Load More"

    fetchImages(searchQuery, page)
      .then(data => {
        if (!data.hits || !Array.isArray(data.hits)) {
          throw new Error('Unexpected response format');
        }

        const images = data.hits;
        const markup = createMarkup(images);
        gallery.insertAdjacentHTML('beforeend', markup);

        // Оновлення SimpleLightbox після додавання нових зображень
        const lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
        lightbox.refresh();

        totalHits = data.totalHits;

        // Показуємо кнопку "Load More" якщо є більше результатів
        if (totalHits > gallery.children.length) {
          showLoadMoreBtn(loadMoreBtn);
        }

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

  function onLoadMore() {
    page += 1;
    showLoadingIndicatorBtn(loaderBtn);
    fetchImages(searchQuery, page)
      .then(data => {
        hideLoadingIndicatorBtn(loaderBtn);

        if (!data.hits || !Array.isArray(data.hits)) {
          throw new Error('Unexpected response format');
        }

        const images = data.hits;
        const markup = createMarkup(images);
        gallery.insertAdjacentHTML('beforeend', markup);

        // Оновлення SimpleLightbox після додавання нових зображень
        const lightbox = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionDelay: 250,
        });
        lightbox.refresh();

        // Показуємо кнопку "Load More" якщо є більше результатів
        if (totalHits > gallery.children.length) {
          showLoadMoreBtn(loadMoreBtn);
        } else {
          hideLoadMoreBtn(loadMoreBtn);
        }

        smoothScroll();
      })
      .catch(error => {
        hideLoadingIndicatorBtn(loaderBtn);
        iziToast.error({
          title: 'Error',
          message: error.message,
        });
      });
  }

  function smoothScroll() {
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
