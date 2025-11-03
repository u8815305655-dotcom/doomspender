// Backend-ready Data Layer (most: localStorage; később: API)
export const DataLayer = {
  // profile
  async getProfile() {
    const r = localStorage.getItem("profile");
    return r ? JSON.parse(r) : null;
  },
  async saveProfile(p) {
    localStorage.setItem("profile", JSON.stringify(p));
  },
  async deleteProfile() {
    localStorage.removeItem("profile");
  },

  // items
  async getItems() {
    const r = localStorage.getItem("items");
    return r ? JSON.parse(r) : [];
  },
  async saveItem(item) {
    const arr = await this.getItems();
    arr.unshift(item);
    localStorage.setItem("items", JSON.stringify(arr));
  },
  async deleteItem(id) {
    const arr = await this.getItems();
    const out = arr.filter(x => x.id !== id);
    localStorage.setItem("items", JSON.stringify(out));
  },
  async updateItem(id, patch) {
    const arr = await this.getItems();
    const out = arr.map(x => x.id === id ? {...x, ...patch} : x);
    localStorage.setItem("items", JSON.stringify(out));
  },
  async clearAll() {
    localStorage.removeItem("items");
  },

  // mock API hooks (későbbre)
  async apiGet(endpoint){ console.log("[MOCK GET]", endpoint); return []; },
  async apiPost(endpoint, data){ console.log("[MOCK POST]", endpoint, data); return {ok:true}; }
};
