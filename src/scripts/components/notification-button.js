import PushNotification from '../utils/push-notification.js';
import { getAccessToken } from '../utils/auth.js';

export default class NotificationButton {
  constructor() {
    this.isSubscribed = false;
    this.button = null;
  }

  async render() {
    this.isSubscribed = await PushNotification.isSubscribed();
    
    const buttonText = this.isSubscribed ? 'Matikan Notifikasi' : 'Aktifkan Notifikasi';
    const buttonClass = this.isSubscribed ? 'btn-outline' : 'btn-primary';
    
    return `
      <button 
        id="notification-toggle" 
        class="btn ${buttonClass}"
        aria-label="${buttonText}"
      >
        ${buttonText}
      </button>
    `;
  }

  async afterRender() {
    this.button = document.getElementById('notification-toggle');
    if (this.button) {
      this.button.addEventListener('click', () => this.#handleToggle());
    }
  }

  async #handleToggle() {
    if (!getAccessToken()) {
      alert('Silakan login terlebih dahulu untuk menggunakan fitur notifikasi');
      return;
    }

    try {
      this.button.disabled = true;
      this.button.textContent = 'Memproses...';

      if (this.isSubscribed) {
        await PushNotification.unsubscribe();
        this.isSubscribed = false;
        this.button.textContent = 'Aktifkan Notifikasi';
        this.button.className = 'btn btn-primary';
        alert('Notifikasi berhasil dimatikan');
      } else {
        await PushNotification.subscribe();
        this.isSubscribed = true;
        this.button.textContent = 'Matikan Notifikasi';
        this.button.className = 'btn btn-outline';
        alert('Notifikasi berhasil diaktifkan');
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
      alert('Terjadi kesalahan: ' + error.message);
      
      // Reset button state
      const buttonText = this.isSubscribed ? 'Matikan Notifikasi' : 'Aktifkan Notifikasi';
      const buttonClass = this.isSubscribed ? 'btn-outline' : 'btn-primary';
      this.button.textContent = buttonText;
      this.button.className = `btn ${buttonClass}`;
    } finally {
      this.button.disabled = false;
    }
  }
}