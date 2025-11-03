import { reactionMessages } from "../data/messages.js";
import { DataLayer } from "./dataLayer.js";

const $ = s => document.querySelector(s);
const fmtFt = v => new Intl.NumberFormat("hu-HU",{style:"currency",currency:"HUF",maximumFractionDigits:0}).format(Number(v||0));

const state = {
  profile: null,
  items: [],
  current: null // {id,name,price,hours}
};

async function boot(){
  state.profile = await DataLayer.getProfile();
  state.items = await DataLayer.getItems();
  bindUI();
  hydrateUI();
}

function bindUI(){
  $("#saveProfile").addEventListener("click", onSaveProfile);
  $("#resetProfile").addEventListener("click", onResetProfile);

  $("#calcButton").addEventListener("click", onCalc);
  $("#saveButton").addEventListener("click", () => onDecision("save"));
  $("#buyButton").addEventListener("click", () => onDecision("buy"));

  $("#clearAll").addEventListener("click", async ()=>{
    if(!confirm("Biztos törlöd az összes tételt?")) return;
    await DataLayer.clearAll(); state.items=[]; renderResults();
  });
}

function hydrateUI(){
  if(state.profile){
    $("#profile-section").classList.add("hidden");
    $("#calculator-section").classList.remove("hidden");
    $("#results-section").classList.remove("hidden");
    renderResults();
  }else{
    $("#profile-section").classList.remove("hidden");
    $("#calculator-section").classList.add("hidden");
    $("#results-section").classList.add("hidden");
  }
}

async function onSaveProfile(){
  const profile = {
    name: $("#name").value.trim(),
    age: Number($("#age").value),
    salary: Number($("#salary").value),
    hours: Number($("#hours").value),
  };
  if(!profile.name || !profile.age || !profile.salary || !profile.hours){
    coach("Tölts ki minden mezőt, kérlek."); return;
  }
  await DataLayer.saveProfile(profile);
  state.profile = profile;
  coach(`Szia ${profile.name}! Készen állsz az okos döntésekre. 😎`);
  hydrateUI();
}

async function onResetProfile(){
  if(!confirm("Biztos törlöd a profilodat? (Az adatok megmaradnak)")) return;
  await DataLayer.deleteProfile(); state.profile=null; hydrateUI();
}

function onCalc(){
  const name = $("#itemName").value.trim();
  const price = Number($("#itemPrice").value);
  if(!name || !price || !state.profile){ coach("Add meg a nevet és az árat!"); return; }

  const hourly = state.profile.salary / (state.profile.hours * 4);
  const hours = price / hourly;

  state.current = { id: Date.now(), name, price, hours };

  $("#calcResult").textContent = `Ez kb. ${hours.toFixed(1)} munkaórád.`;
  $("#calcResultWrap").classList.remove("hidden");
}

async function onDecision(type){
  if(!state.current) return;
  const item = {
    id: state.current.id,
    name: state.current.name,
    price: state.current.price,
    type, // "save" | "buy"
    hours: state.current.hours
  };
  await DataLayer.saveItem(item);
  state.items.unshift(item);

  if(type==="buy"){
    if(item.hours>10){
      const msg = reactionMessages[Math.floor(Math.random()*reactionMessages.length)];
      coach(msg);
    }else{
      coach("Oké, megvetted – használd örömmel. 🛍️");
    }
  }else{
    coach("Szép döntés! A jövőbeli én tapsol. 👏");
  }

  // reset decision area
  $("#calcResultWrap").classList.add("hidden");
  $("#itemName").value = "";
  $("#itemPrice").value = "";

  renderResults();
}

function renderResults(){
  // totals
  const saved = state.items.filter(x=>x.type==="save").reduce((s,x)=>s+x.price,0);
  const spent = state.items.filter(x=>x.type==="buy").reduce((s,x)=>s+x.price,0);
  $("#totalSaved").textContent = fmtFt(saved);
  $("#totalSpent").textContent = fmtFt(spent);
  $("#net").textContent = fmtFt(saved - spent);

  // list
  const ul = $("#itemList"); ul.innerHTML = "";
  if(state.items.length===0){
    ul.innerHTML = `<li class="muted">Még nincs tétel. Kezdd a kalkulátorral.</li>`;
    return;
  }

  state.items.forEach(x=>{
    const li = document.createElement("li"); li.className="item";
    const name = document.createElement("span"); name.className="name " + (x.type==="buy"?"bad":"good"); name.textContent = x.name;
    const price = document.createElement("span"); price.className="price"; price.textContent = fmtFt(x.price);
    const actions = document.createElement("span"); actions.className="actions";
    const del = document.createElement("button"); del.className="action del"; del.textContent="Törlöm";
    del.onclick = async ()=>{ await DataLayer.deleteItem(x.id); state.items = state.items.filter(i=>i.id!==x.id); renderResults(); };
    const edit = document.createElement("button"); edit.className="action edit"; edit.textContent="Szerk.";
    edit.onclick = ()=> inlineEdit(x.id);
    actions.append(edit, del);
    li.append(name, price, actions);
    ul.appendChild(li);
  });
}

function inlineEdit(id){
  const li = Array.from(document.querySelectorAll("#itemList .item")).find((el,idx)=> state.items[idx].id===id);
  if(!li) return;
  const idx = Array.from(li.parentNode.children).indexOf(li);
  const item = state.items[idx];

  li.innerHTML="";
  const inputName = document.createElement("input"); inputName.value = item.name; inputName.className=""; inputName.style.marginRight="8px";
  const inputPrice = document.createElement("input"); inputPrice.type="number"; inputPrice.value=item.price; inputPrice.style.maxWidth="140px";
  const ok = document.createElement("button"); ok.className="action edit"; ok.textContent="OK";
  const cancel = document.createElement("button"); cancel.className="action ghost"; cancel.textContent="Mégse";

  ok.onclick = async ()=>{
    const patch = {name: inputName.value.trim(), price: Number(inputPrice.value)};
    await DataLayer.updateItem(item.id, patch);
    state.items[idx] = {...item, ...patch};
    renderResults();
  };
  cancel.onclick = ()=> renderResults();

  li.append(inputName, inputPrice, ok, cancel);
}

function coach(text){
  const b = $("#coachBubble");
  b.textContent = text;
  b.classList.remove("hidden");
  clearTimeout(b._t);
  b._t = setTimeout(()=> b.classList.add("hidden"), 4200);
}

boot();
