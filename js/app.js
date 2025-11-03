// --- Importok ---
import { reactionMessages } from "../data/messages.js";

// --- Alapállapot ---
const state = {
  name: "",
  age: null,
  salary: null,
  hours: null,
  saved: [],
  spent: [],
};

// --- Segédfüggvények ---
const $ = (s) => document.querySelector(s);
const createEl = (t, c = "", txt = "") => {
  const el = document.createElement(t);
  if (c) el.className = c;
  if (txt) el.innerText = txt;
  return el;
};

// --- Adatmentés ---
function saveProfile() {
  const name = $("#name").value.trim();
  const age = $("#age").value.trim();
  const salary = $("#salary").value.trim();
  const hours = $("#hours").value.trim();

  if (!name || !age || !salary || !hours) {
    alert("Kérlek, töltsd ki az összes mezőt!");
    return;
  }

  state.name = name;
  state.age = age;
  state.salary = parseInt(salary);
  state.hours = parseInt(hours);

  localStorage.setItem("profile", JSON.stringify(state));

  // Tovább a kalkulátorhoz
  window.location.href = "calculator.html";
}

// --- Profil törlése ---
function deleteProfile() {
  if (confirm("Biztosan törlöd a profilod?")) {
    localStorage.removeItem("profile");
    window.location.reload();
  }
}

// --- Kalkuláció ---
function calculateHours(cost) {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile) return 0;
  const hourly = profile.salary / (profile.hours * 4); // heti -> havi
  return (cost / hourly).toFixed(1);
}

// --- Apádhelyett Anyád reakciók ---
function getReaction(cost, action) {
  if (action === "save") {
    const positive = reactionMessages.positive;
    return positive[Math.floor(Math.random() * positive.length)];
  } else {
    if (cost > 10) {
      const warning = reactionMessages.warning;
      return warning[Math.floor(Math.random() * warning.length)];
    } else {
      const neutral = reactionMessages.neutral;
      return neutral[Math.floor(Math.random() * neutral.length)];
    }
  }
}

// --- Kalkulátor logika ---
function initCalculator() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile) {
    window.location.href = "index.html";
    return;
  }

  const inputName = $("#productName");
  const inputPrice = $("#productPrice");
  const resultSection = $("#result");
  const calcBtn = $("#calcBtn");

  calcBtn.addEventListener("click", () => {
    const name = inputName.value.trim();
    const price = parseFloat(inputPrice.value);

    if (!name || !price || price <= 0) {
      alert("Add meg a termék nevét és árát!");
      return;
    }

    const hoursNeeded = calculateHours(price);
    resultSection.innerHTML = `
      <p>A termék ára <strong>${price.toLocaleString()} Ft</strong>.</p>
      <p>Ez kb. <strong>${hoursNeeded}</strong> munkaóra!</p>
      <div class="buttons">
        <button id="saveBtn" class="btn green">Megspórolom</button>
        <button id="buyBtn" class="btn red">Megveszem</button>
      </div>
    `;

    $("#saveBtn").addEventListener("click", () => handleAction(name, price, "save"));
    $("#buyBtn").addEventListener("click", () => handleAction(name, price, "buy"));
  });
}

// --- Akciók kezelése ---
function handleAction(name, price, action) {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile) return;

  const listKey = action === "save" ? "saved" : "spent";
  profile[listKey].push({ name, price });
  localStorage.setItem("profile", JSON.stringify(profile));

  const reaction = getReaction(price, action);
  showReaction(reaction);
}

// --- Apádhelyett Anyád kiírás ---
function showReaction(msg) {
  let bubble = $(".bubble");
  if (!bubble) {
    bubble = createEl("div", "bubble");
    document.body.appendChild(bubble);
  }
  bubble.innerText = `Apádhelyett Anyád 😏: ${msg}`;
  bubble.classList.remove("hidden");
  setTimeout(() => bubble.classList.add("hidden"), 4000);
}

// --- Listaoldal funkció ---
function initList() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!profile) {
    window.location.href = "index.html";
    return;
  }

  const list = $("#itemList");
  const totalSaved = $("#totalSaved");
  const totalSpent = $("#totalSpent");

  list.innerHTML = "";

  let sumSaved = 0;
  let sumSpent = 0;

  profile.saved.forEach((item) => {
    const li = createEl("li", "saved", `${item.name} – ${item.price} Ft`);
    list.appendChild(li);
    sumSaved += item.price;
  });

  profile.spent.forEach((item) => {
    const li = createEl("li", "spent", `${item.name} – ${item.price} Ft`);
    list.appendChild(li);
    sumSpent += item.price;
  });

  totalSaved.innerText = sumSaved.toLocaleString() + " Ft";
  totalSpent.innerText = sumSpent.toLocaleString() + " Ft";
}

// --- Oldalfüggő inicializálás ---
function boot() {
  if ($("#saveProfile")) {
    $("#saveProfile").addEventListener("click", saveProfile);
  }
  if ($("#deleteProfile")) {
    $("#deleteProfile").addEventListener("click", deleteProfile);
  }
  if ($("#calcBtn")) {
    initCalculator();
  }
  if ($("#itemList")) {
    initList();
  }
}

// --- Start ---
boot();
