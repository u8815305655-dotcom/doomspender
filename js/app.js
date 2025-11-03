import { reactionMessages } from "../data/messages.js";
import { DataLayer } from "./dataLayer.js";

const state = {
  profile: null,
  items: []
};

const $ = (s) => document.querySelector(s);

async function init() {
  state.profile = await DataLayer.getProfile();
  state.items = await DataLayer.getItems();

  if (state.profile) {
    $("#profile-section").classList.add("hidden");
    $("#calculator-section").classList.remove("hidden");
    $("#results-section").classList.remove("hidden");
    renderItems();
  }

  $("#saveProfile").addEventListener("click", saveProfile);
  $("#calcButton").addEventListener("click", calculate);
  $("#saveButton").addEventListener("click", saveItem);
  $("#buyButton").addEventListener("click", buyItem);
}

async function saveProfile() {
  const profile = {
    name: $("#name").value,
    age: $("#age").value,
    salary: $("#salary").value,
    hours: $("#hours").value
  };
  await DataLayer.saveProfile(profile);
  state.profile = profile;

  $("#profile-section").classList.add("hidden");
  $("#calculator-section").classList.remove("hidden");
  $("#results-section").classList.remove("hidden");
}

function calculate() {
  const name = $("#itemName").value;
  const price = parseFloat($("#itemPrice").value);

  if (!name || !price || !state.profile) return;

  const hourlyWage = state.profile.salary / (4 * state.profile.hours);
  const hoursNeeded = (price / hourlyWage).toFixed(1);

  $("#calcResult").textContent = `Ez kb. ${hoursNeeded} óra munkádba kerülne.`;
  $("#decisionButtons").classList.remove("hidden");

  state.currentItem = { id: Date.now(), name, price, hoursNeeded };
}

async function saveItem() {
  const item = { ...state.currentItem, type: "saved" };
  await DataLayer.saveItem(item);
  state.items.unshift(item);
  renderItems();
  $("#calcResult").textContent = "Szép munka! 💪 Megspóroltad.";
  $("#decisionButtons").classList.add("hidden");
}

async function buyItem() {
  const item = { ...state.currentItem, type: "spent" };
  await DataLayer.saveItem(item);
  state.items.unshift(item);
  renderItems();
  $("#decisionButtons").classList.add("hidden");

  if (item.hoursNeeded > 10) {
    const msg = reactionMessages[Math.floor(Math.random() * reactionMessages.length)];
    $("#calcResult").textContent = msg;
  } else {
    $("#calcResult").textContent = "Rendben, megvetted. 🛍️";
  }
}

function renderItems() {
  const list = $("#itemList");
  list.innerHTML = "";
  let totalSaved = 0;
  let totalSpent = 0;

  state.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price.toLocaleString()} Ft`;
    li.className = item.type === "saved" ? "saved" : "spent";
    list.appendChild(li);

    if (item.type === "saved") totalSaved += item.price;
    else totalSpent += item.price;
  });

  $("#totalSaved").textContent = totalSaved.toLocaleString();
  $("#totalSpent").textContent = totalSpent.toLocaleString();
}

init();
