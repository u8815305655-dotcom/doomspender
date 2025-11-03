import { reactionMessages } from "../data/messages.js";
import { DataLayer } from "./dataLayer.js";


const state = {
  name: "",
  age: null,
  salary: null,
  hours: null,
  saved: [],
  spent: []
};

// segédfüggvények
const $ = (s) => document.querySelector(s);
const createEl = (t, c = "", txt = "") => {
  const el = document.createElement(t);
  if (c) el.className = c;
  if (txt) el.textContent = txt;
  return el;
};

function init() {
  renderProfileSetup();
  setupNav();
}

function setupNav() {
  document.querySelectorAll("nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("nav button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const page = btn.dataset.page;
      renderPage(page);
    });
  });
}

function renderPage(page) {
  $("main").innerHTML = "";
  if (page === "calc") renderCalculator();
  if (page === "list") renderList();
  if (page === "profile") renderProfileSetup(true);
}

function renderProfileSetup(editing = false) {
  $("main").innerHTML = "";
  const card = createEl("div", "card");
  card.innerHTML = `
    <h2>${editing ? "Profil szerkesztése" : "Nettó béred és munkaidőd"}</h2>
    <input id="name" placeholder="Beceneved" value="${state.name || ""}" />
    <input id="age" placeholder="Életkorod" type="number" value="${state.age || ""}" />
    <input id="salary" placeholder="Nettó havi fizetés (Ft)" type="number" value="${state.salary || ""}" />
    <input id="hours" placeholder="Heti munkaórák" type="number" value="${state.hours || ""}" />
    <button id="save" class="green">Mentés</button>
  `;
  $("main").appendChild(card);
  $("#save").onclick = () => {
    state.name = $("#name").value;
    state.age = +$("#age").value;
    state.salary = +$("#salary").value;
    state.hours = +$("#hours").value;
    renderCalculator();
  };
}

function renderCalculator() {
  $("main").innerHTML = "";
  const card = createEl("div", "card");
  card.innerHTML = `
    <h2>Mit szeretnél venni, ${state.name || "Barátom"}?</h2>
    <input id="product" placeholder="Termék neve" />
    <input id="price" placeholder="Termék ára (Ft)" type="number" />
    <button id="calc" class="yellow">Kiszámolom</button>
    <div id="result"></div>
  `;
  $("main").appendChild(card);

  $("#calc").onclick = () => {
    const product = $("#product").value;
    const price = +$("#price").value;
    if (!product || !price) return alert("Add meg a termék nevét és árát!");
    const hourly = state.salary / (4 * state.hours);
    const hoursNeeded = (price / hourly).toFixed(1);
    $("#result").innerHTML = `
      <p>${hoursNeeded} órát kell dolgoznod ezért.</p>
      <button id="saveBtn" class="green">Megspórolom</button>
      <button id="buyBtn" class="red">Megveszem</button>
    `;
    $("#saveBtn").onclick = () => {
      state.saved.push({ product, price });
      renderList();
    };
    $("#buyBtn").onclick = () => {
      state.spent.push({ product, price });
      if (hoursNeeded > 10) showReaction();
      renderList();
    };
  };
}

function showReaction() {
  const msg = reactionMessages[Math.floor(Math.random() * reactionMessages.length)];
  alert(`🫨 Apádhelyett Anyád mondja: ${msg}`);
}

function renderList() {
  $("main").innerHTML = "";
  const card = createEl("div", "card");
  card.innerHTML = `<h2>Eredmények</h2>`;
  const ul = createEl("ul", "result-list");

  state.spent.forEach((item) => {
    const li = createEl("li", "red");
    li.textContent = `${item.product} – ${item.price.toLocaleString()} Ft`;
    ul.appendChild(li);
  });

  state.saved.forEach((item) => {
    const li = createEl("li", "green");
    li.textContent = `${item.product} – ${item.price.toLocaleString()} Ft`;
    ul.appendChild(li);
  });

  card.appendChild(ul);

  const totalSaved = state.saved.reduce((s, i) => s + i.price, 0);
  const totalSpent = state.spent.reduce((s, i) => s + i.price, 0);
  const summary = createEl("div", "summary", `
    Megspórolt összeg: ${totalSaved.toLocaleString()} Ft 💚 | Elköltött: ${totalSpent.toLocaleString()} Ft ❤️
  `);
  card.appendChild(summary);
  $("main").appendChild(card);
}

window.addEventListener("DOMContentLoaded", init);

