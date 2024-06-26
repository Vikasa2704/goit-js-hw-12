// js/render-functions.js

// Показує індикатор завантаження
export function showLoader(loaderContainer) {
  loaderContainer.style.display = 'flex';
}

// Приховує індикатор завантаження
export function hideLoader(loaderContainer) {
  loaderContainer.style.display = 'none';
}

// Показує кнопку "Завантажити ще"
export function showLoadMoreBtn(loadMoreBtn) {
  loadMoreBtn.classList.remove('hidden');
}

// Приховує кнопку "Завантажити ще"
export function hideLoadMoreBtn(loadMoreBtn) {
  loadMoreBtn.classList.add('hidden');
}

// Показує індикатор завантаження на кнопці
export function showLoadingIndicatorBtn(loaderBtn) {
  loaderBtn.classList.remove('hidden');
}

// Приховує індикатор завантаження на кнопці
export function hideLoadingIndicatorBtn(loaderBtn) {
  loaderBtn.classList.add('hidden');
}

// Створює розмітку для зображень
export function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <div class="photo-card">
          <a href="${largeImageURL}" target="_blank">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image" />
          </a>
          <div class="photo-card__info">
            <p class="photo-card__info-item"><b>Likes:</b> ${likes}</p>
            <p class="photo-card__info-item"><b>Views:</b> ${views}</p>
            <p class="photo-card__info-item"><b>Comments:</b> ${comments}</p>
            <p class="photo-card__info-item"><b>Downloads:</b> ${downloads}</p>
          </div>
        </div>
      `
    )
    .join('');
}

// Очищує галерею
export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}
