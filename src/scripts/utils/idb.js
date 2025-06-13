export default class IDBHelper {
  static #dbName = 'StoryMapDB';
  static #version = 1;
  static #storeName = 'bookmarks';

  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#version);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        console.log('IndexedDB opened successfully');
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        console.log('Upgrading IndexedDB schema');
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(this.#storeName)) {
          const store = db.createObjectStore(this.#storeName, { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          console.log('Object store created:', this.#storeName);
        }
      };
    });
  }

  static async addStory(story) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.#storeName], 'readwrite');
      const store = transaction.objectStore(this.#storeName);
      
      const result = await new Promise((resolve, reject) => {
        const request = store.add(story);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      console.log('Story added to IndexedDB:', story.id);
      return result;
    } catch (error) {
      console.error('Error adding story to IndexedDB:', error);
      throw error;
    }
  }

  static async getAllStories() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.#storeName], 'readonly');
      const store = transaction.objectStore(this.#storeName);
      
      const result = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      console.log('Retrieved stories from IndexedDB:', result.length);
      return result;
    } catch (error) {
      console.error('Error getting all stories from IndexedDB:', error);
      throw error;
    }
  }

  static async deleteStory(id) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.#storeName], 'readwrite');
      const store = transaction.objectStore(this.#storeName);
      
      const result = await new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      console.log('Story deleted from IndexedDB:', id);
      return result;
    } catch (error) {
      console.error('Error deleting story from IndexedDB:', error);
      throw error;
    }
  }

  static async getStory(id) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.#storeName], 'readonly');
      const store = transaction.objectStore(this.#storeName);
      
      const result = await new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      return result;
    } catch (error) {
      console.error('Error getting story from IndexedDB:', error);
      throw error;
    }
  }

  static async isStoryBookmarked(id) {
    try {
      const story = await this.getStory(id);
      return !!story;
    } catch (error) {
      return false;
    }
  }

  static async clearAllStories() {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.#storeName], 'readwrite');
      const store = transaction.objectStore(this.#storeName);
      
      const result = await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      console.log('All stories cleared from IndexedDB');
      return result;
    } catch (error) {
      console.error('Error clearing stories from IndexedDB:', error);
      throw error;
    }
  }
}