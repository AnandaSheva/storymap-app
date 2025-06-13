import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" class="story-list-button" href="#/">Daftar Cerita</a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Cerita Tersimpan</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-report-button" class="btn new-report-button" href="#/new">Buat Cerita <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Yuk, buat cerita baru.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoriesDetailErrorTemplate(message) {
  return `
    <div id="stories-detail-error" class="stories-detail__error">
      <h2>Terjadi kesalahan pengambilan detail laporan</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoriesItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div tabindex="0" class="story-item" data-reportid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="Foto dari ${name}">
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 class="story-title story-item__title">Cerita dari ${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
            </div>
            <div class="story-item__location">
              <i class="fas fa-map"></i> ${lat && lon ? `(${lat}, ${lon})` : 'Tidak diketahui'}
            </div>
          </div>
        </div>
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <div class="story-item__more-info">
          <div class="story-item__author">
            Ditulis oleh: ${name}
          </div>
        </div>
    
        <a class="btn story-item__read-more" href="#/story/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateStoriesDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoriesDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  location,
  lat,
  lon,
}) {

  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const imageHtml = generateStoriesDetailImageTemplate(photoUrl, name);
  const locationDisplay = location.placeName && lat && lon
    ? `${location.placeName} (${lat}, ${lon})`
    : location.placeName || (lat && lon ? `(${lat}, ${lon})` : 'Tidak diketahui');

  console.log('location object:', location);



  return `
    <div class="story-detail__header">
      <h1 id="title" class="story-detail__title">${name}</h1>

      <div class="story-detail__more-info">
        <div class="story-detail__more-info__inline">
          <div id="createdat" class="story-detail__createdat"><i class="fas fa-calendar-alt">
          </i> ${createdAtFormatted}</div>
      </div>

         <div class="story-detail__location__place-name">
          <i class="fas fa-map"></i> ${locationDisplay}
         </div>

        </div>
        <div id="author" class="story-detail__author">
          Ditulis oleh: ${name}
        </div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__images__container">
        <div id="images" class="story-detail__images">${imageHtml}</div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h2 class="story-detail__description__title">Informasi Lengkap</h2>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <h2 class="story-detail__description__title">Lokasi Cerita</h2>
      <div id="map" style="height: 300px; width: 100%; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); margin-top: 1rem;"></div>
    </div>
  `;
}


export const generateSaveStoriesButtonTemplate = () => `
  <button id="story-detail-save" class="btn btn-primary">
    <i class="icon-bookmark"></i> Simpan ke Bookmark
  </button>
`;

export const generateRemoveStoriesButtonTemplate = () => `
  <button id="story-detail-remove" class="btn btn-outline">
    <i class="icon-bookmark-filled"></i> Hapus dari Bookmark
  </button>
`;

export const generateNotificationButtonTemplate = () => `
  <div id="notification-button-container"></div>
`;
