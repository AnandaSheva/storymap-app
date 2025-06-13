// ...existing code...
import NotificationButton from './notification-button.js';
import { getAccessToken } from '../utils/auth.js';

export default class Navigation {
  constructor() {
    this.notificationButton = new NotificationButton();
  }

  async render() {
    const isLoggedIn = !!getAccessToken();
    const notificationButtonHtml = isLoggedIn ? await this.notificationButton.render() : '';
    
    return `
      <nav class="nav">
        <div class="nav-inner">
          <a class="nav-brand" href="/">
            <img src="./images/logo.png" alt="StoryMap" />
          </a>
          <ul class="nav-list">
            <li class="nav-item">
              <a href="#/" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
              <a href="#/bookmark" class="nav-link">Bookmark</a>
            </li>
            ${isLoggedIn ? `
              <li class="nav-item">
                <a href="#/new" class="nav-link">Tambah Cerita</a>
              </li>
              <li class="nav-item">
                ${notificationButtonHtml}
              </li>
              <li class="nav-item">
                <button id="logout-button" class="btn btn-outline">Logout</button>
              </li>
            ` : `
              <li class="nav-item">
                <a href="#/login" class="nav-link">Login</a>
              </li>
            `}
          </ul>
        </div>
      </nav>
    `;
  }

  async afterRender() {
    if (getAccessToken()) {
      await this.notificationButton.afterRender();
      
      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', this.#handleLogout);
      }
    }
  }

  #handleLogout() {
    // ...existing logout code...
  }
}