function showCoachMessage(text) {
  const bubble = document.getElementById("coachBubble");
  bubble.textContent = text;
  bubble.classList.remove("hidden");
  setTimeout(() => bubble.classList.add("hidden"), 4000);
}

// Példa: ha valaki 10 óránál többet költ
document.getElementById("buyButton").addEventListener("click", () => {
  const random = [
    "Na, ezt nem biztos hogy Anyád jóváhagyná 😏",
    "Ennyiért inkább vegyél virágot.",
    "Kifizetve… de legalább bűntudattal 🫠",
    "Nem volt muszáj, de megtetted 😬",
    "Tudod, hogy dolgozni fogsz érte hétvégén is, ugye?",
  ];
  showCoachMessage(random[Math.floor(Math.random() * random.length)]);
});
