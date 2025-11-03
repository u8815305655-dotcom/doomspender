// Data Layer – az adatkezelés absztrakciója

export const DataLayer = {
  // PROFIL
  async getProfile() {
    const raw = localStorage.getItem("profile");
    return raw ? JSON.parse(raw) : null;
  },

  async saveProfile(profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
  },

  async deleteProfile() {
    localStorage.removeItem("profile");
  },

  // TERMÉKEK
  async getItems() {
    const raw = localStorage.getItem("items");
    return raw ? JSON.parse(raw) : [];
  },

  async saveItem(item) {
    const items = await this.getItems();
    items.unshift(item);
    localStorage.setItem("items", JSON.stringify(items));
  },

  async deleteItem(id) {
    const items = await this.getItems();
    const filtered = items.filter((x) => x.id !== id);
    localStorage.setItem("items", JSON.stringify(filtered));
  },

  // MOCK backend hívások (előre készítve)
  async apiGet(endpoint) {
    // 🔥 később ide jön a fetch(`https://api.sajatbackend.hu/${endpoint}`)
    console.log("[MOCK API GET]", endpoint);
    return [];
  },

  async apiPost(endpoint, data) {
    console.log("[MOCK API POST]", endpoint, data);
    return { success: true };
  }
};

