import IDBHelper from '../../utils/idb.js';
import { generateStoriesItemTemplate, generateStoriesListEmptyTemplate } from '../../templates.js';

export default class BookmarkPage {
  async render() {
    return `
      <section class="hero">
        <div class="hero-inner">
          <h1 class="hero-title">Cerita Tersimpan</h1>
          <p class="hero-tagline">Kumpulan cerita yang telah Anda simpan untuk dibaca kembali</p>
        </div>
      </section>
      
      <section class="container">
        <div class="bookmark-actions">
          <button id="clear-all-bookmarks" class="btn btn-outline">
            Hapus Semua Bookmark
          </button>
        </div>
        
        <div id="bookmark-list" class="story-list">
          <div class="loading">Memuat cerita tersimpan...</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#loadBookmarkedStories();
    this.#initClearAllButton();
  }

  async #loadBookmarkedStories() {
    const container = document.getElementById('bookmark-list');
    
    try {
      const stories = await IDBHelper.getAllStories();
      
      if (stories.length === 0) {
        container.innerHTML = generateStoriesListEmptyTemplate();
        return;
      }

      // Sort by created date (newest first)
      stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const html = stories.map(story => this.#generateBookmarkItemTemplate(story)).join('');
      container.innerHTML = `<div class="story-list">${html}</div>`;
      
      // Add event listeners for delete buttons
      this.#addDeleteButtonListeners();
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      container.innerHTML = `
        <div class="error-message">
          <p>Terjadi kesalahan saat memuat cerita tersimpan.</p>
          <button onclick="location.reload()" class="btn btn-primary">Muat Ulang</button>
        </div>
      `;
    }
  }

  #generateBookmarkItemTemplate(story) {
    return `
      <div class="story-item" data-story-id="${story.id}">
        <div class="story-item__thumb">
          <img src="${story.photoUrl}" alt="${story.name}" loading="lazy">
        </div>
        <div class="story-item__body">
          <h3 class="story-item__name">
            <a href="/#/story/${story.id}">${story.name}</a>
          </h3>
          <p class="story-item__description">${story.description}</p>
          <div class="story-item__meta">
            <span class="story-item__date">${new Date(story.createdAt).toLocaleDateString('id-ID')}</span>
            ${story.lat && story.lon ? '<span class="story-item__location">📍 Dengan Lokasi</span>' : ''}
          </div>
          <div class="story-item__actions">
            <a href="/#/story/${story.id}" class="btn btn-primary btn-sm">Baca</a>
            <button class="btn btn-outline btn-sm delete-bookmark" data-story-id="${story.id}">
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;
  }

  #addDeleteButtonListeners() {
    document.querySelectorAll('.delete-bookmark').forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const storyId = button.dataset.storyId;
        await this.#deleteStory(storyId);
      });
    });
  }

  async #deleteStory(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus cerita ini dari bookmark?')) {
      return;
    }

    try {
      await IDBHelper.deleteStory(id);
      alert('Cerita berhasil dihapus dari bookmark!');
      await this.#loadBookmarkedStories();
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Terjadi kesalahan saat menghapus cerita');
    }
  }

  #initClearAllButton() {
    const clearButton = document.getElementById('clear-all-bookmarks');
    if (clearButton) {
      clearButton.addEventListener('click', async () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua bookmark?')) {
          try {
            await IDBHelper.clearAllStories();
            alert('Semua bookmark berhasil dihapus!');
            await this.#loadBookmarkedStories();
          } catch (error) {
            console.error('Error clearing bookmarks:', error);
            alert('Terjadi kesalahan saat menghapus bookmark');
          }
        }
      });
    }
  }
}
