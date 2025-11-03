// Backend-ready Data Layer
export const DataLayer = {
  // Profilkezelés
  async getProfile() {
    const raw = localStorage.getItem("profile");
    return raw ? JSON.parse(raw) : null;
  },

  async saveProfile(profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
  },

  // Termékek
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

  // Mock API-hívások (későbbi bővítéshez)
  async apiGet(endpoint) {
    console.log(`[MOCK GET] /${endpoint}`);
    return [];
  },
  async apiPost(endpoint, data) {
    console.log(`[MOCK POST] /${endpoint}`, data);
    return { success: true };
  }
};
