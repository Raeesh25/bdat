// Personalize this object to make the celebration your own:
// - Set name, birthDate (YYYY-MM-DD), and secretMessage to your details.
// - Put a photo in assets/images and set photo to its relative path or an image URL.
// - Put an audio file in assets/music and set musicFile to its relative path.
// - Edit the wishes, blessings, goals, and envelopes arrays to customize the notes.
// A frontend password is only a playful gate: anyone can inspect client-side JavaScript.
const birthdayConfig = {
  name: "",
  birthDate: "2006-10-30",
  photo: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
  secretPassword: "birthday",
  secretMessage: "You are someone's favorite reason to smile. Keep being your wonderfully irreplaceable self. I love you more than all the candles on this cake.",
  musicFile: "assets/music/birthday-song.mp3",
  wishes: [
    { icon: "♡", title: "The happiest birthday", text: "May today bring the kind of joy that stays with you long after the candles are gone." },
    { icon: "✿", title: "A little appreciation", text: "Thank you for being thoughtful, generous, and the sort of person who makes others feel at home." },
    { icon: "✧", title: "One of a kind", text: "There is no one quite like you—and that is one of the loveliest things about knowing you." },
    { icon: "☼", title: "All the happiness", text: "May laughter find you often, good surprises find you unexpectedly, and happiness feel right at home." },
    { icon: "❀", title: "Your wonderful self", text: "Your warmth, your courage, and the way you see the world make it brighter for everyone around you." },
    { icon: "☁", title: "Memories to keep", text: "Here’s to all the little moments that become favorite stories—and all the beautiful ones still to come." },
    { icon: "♡", title: "Never forget", text: "You matter more than you know. Your presence makes a difference, simply because you are you." }
  ],
  blessings: [
    { icon: "☼", text: "Good health and a heart full of happiness" },
    { icon: "✦", text: "Meaningful success in all you set out to do" },
    { icon: "☾", text: "Peace, positivity, and room to breathe" },
    { icon: "❋", text: "Strength and softness through every challenge" },
    { icon: "↗", text: "New opportunities and wonderful adventures" },
    { icon: "♡", text: "Genuine friends who always show up" },
    { icon: "✧", text: "Dreams that grow into something real" },
    { icon: "❀", text: "A life rich with love and beautiful memories" }
  ],
  goals: [
    "Take one brave step toward a personal dream",
    "Learn something that makes you curious",
    "Explore somewhere new, near or far",
    "Make time for memories with your favorite people",
    "Celebrate the person you are becoming",
    "Notice and celebrate the little victories",
    "Say yes to an opportunity that excites you",
    "Keep believing in yourself, especially on hard days"
  ],
  envelopes: [
    { title: "A birthday letter", message: "Happy birthday, lovely human. I hope you feel celebrated in every small and big way today. You deserve a day that feels like a deep breath, a belly laugh, and a warm hug all at once." },
    { title: "A little thank-you", message: "Thank you for the kindness you give so freely, the laughter you bring into a room, and the way you make people feel seen. The world is luckier with you in it." },
    { title: "A wish for you", message: "May the year ahead be kind to your heart. May you find unexpected joy, steady hope, and the courage to follow the things that make you feel most alive." },
    { title: "A gentle reminder", message: "You don't need to have everything figured out to be doing well. Keep going at your own pace. You are allowed to rest, to change, and to begin again." },
    { title: "One last surprise", message: "If birthdays had a measure for how loved you are, yours would need a whole new universe. This is your reminder: you are cherished today, tomorrow, and always." }
  ]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pad2 = (value) => String(value).padStart(2, "0");

function getDisplayName() {
  const raw = (birthdayConfig.name || "").trim();
  return raw || "beautiful soul";
}

function parseBirthDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error("birthdayConfig.birthDate must use YYYY-MM-DD.");
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error("birthdayConfig.birthDate must be a valid calendar date.");
  }
  date.setHours(0, 0, 0, 0);
  if (date > startOfToday()) throw new Error("birthdayConfig.birthDate cannot be in the future.");
  return { year, month, day, date };
}

function startOfToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function calendarDayNumber(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

function birthdayInYear(birth, year) {
  // A Feb 29 birthday is celebrated on Feb 28 in non-leap years.
  const day = birth.month === 2 && birth.day === 29 && new Date(year, 1, 29).getMonth() !== 1 ? 28 : birth.day;
  return new Date(year, birth.month - 1, day);
}

function addCalendarMonths(date, months) {
  const targetMonth = date.getMonth() + months;
  const lastDay = new Date(date.getFullYear(), targetMonth + 1, 0).getDate();
  return new Date(date.getFullYear(), targetMonth, Math.min(date.getDate(), lastDay));
}

function getNextBirthday(birth, today) {
  let year = today.getFullYear();
  let next = birthdayInYear(birth, year);
  if (next < today) next = birthdayInYear(birth, ++year);
  return next;
}

function calendarAge(birth, today) {
  let years = today.getFullYear() - birth.year;
  let anniversary = birthdayInYear(birth, today.getFullYear());
  if (today < anniversary) years -= 1;
  const lastBirthday = birthdayInYear(birth, birth.year + years);
  let months = (today.getFullYear() - lastBirthday.getFullYear()) * 12 + today.getMonth() - lastBirthday.getMonth();
  let monthAnchor = addCalendarMonths(lastBirthday, months);
  if (monthAnchor > today) {
    months -= 1;
    monthAnchor = addCalendarMonths(lastBirthday, months);
  }
  const days = calendarDayNumber(today) - calendarDayNumber(monthAnchor);
  return { years, months, days };
}

function updateBirthdayDisplays(birth) {
  const now = new Date();
  const today = startOfToday();
  const nextBirthday = getNextBirthday(birth, today);
  const countdownMessage = $("#countdown-message");
  const displayName = getDisplayName();
  if (nextBirthday.getTime() === today.getTime()) {
    ["#count-days", "#count-hours", "#count-minutes", "#count-seconds"].forEach((selector) => { $(selector).textContent = "🎉"; });
    countdownMessage.textContent = `It’s your birthday, ${displayName}! Today is all about celebrating you.`;
  } else {
    const remaining = Math.max(0, nextBirthday.getTime() - now.getTime());
    const totalSeconds = Math.floor(remaining / 1000);
    $("#count-days").textContent = Math.floor(totalSeconds / 86400);
    $("#count-hours").textContent = pad2(Math.floor((totalSeconds % 86400) / 3600));
    $("#count-minutes").textContent = pad2(Math.floor((totalSeconds % 3600) / 60));
    $("#count-seconds").textContent = pad2(totalSeconds % 60);
    countdownMessage.textContent = "Every second is one step closer to celebrating you.";
  }

  const age = calendarAge(birth, today);
  $("#age-years").textContent = age.years;
  $("#age-months-days").textContent = `${age.months} ${age.months === 1 ? "month" : "months"} and ${age.days} ${age.days === 1 ? "day" : "days"} into this lovely year`;
  const livedDays = calendarDayNumber(today) - calendarDayNumber(birth.date);
  $("#age-total-days").textContent = livedDays.toLocaleString();
  $("#age-weeks").textContent = Math.floor(livedDays / 7).toLocaleString();
  $("#age-hours").textContent = Math.floor((now.getTime() - birth.date.getTime()) / 3600000).toLocaleString();
}

function renderPersonalizedContent() {
  const displayName = getDisplayName();
  $$("[data-person-name]").forEach((node) => { node.textContent = displayName; });
  document.title = `Happy Birthday!`;
  const photo = $("#birthday-photo");
  if (photo) {
    photo.src = birthdayConfig.photo;
    photo.alt = `Birthday celebration for a beautiful soul`;
  }

  $("#wish-list").innerHTML = birthdayConfig.wishes.map((wish) => `
    <article class="wish-card reveal"><span class="wish-icon" aria-hidden="true">${wish.icon}</span>
      <h3>${wish.title}</h3><p>${wish.text}</p></article>`).join("");
  $("#blessing-list").innerHTML = birthdayConfig.blessings.map((blessing) => `
    <article class="blessing-card reveal"><span aria-hidden="true">${blessing.icon}</span><p>${blessing.text}</p></article>`).join("");
  $("#goal-list").innerHTML = birthdayConfig.goals.map((goal, index) => `
    <label class="goal-card"><input type="checkbox" data-goal-index="${index}"><span class="goal-check" aria-hidden="true"></span>
      <span class="goal-text">${goal}</span></label>`).join("");
  $("#envelope-list").innerHTML = birthdayConfig.envelopes.map((envelope, index) => `
    <article class="envelope-card">
      <button class="envelope-button" type="button" data-envelope-index="${index}" aria-label="Open envelope ${index + 1}: ${envelope.title}">
        <span class="envelope-flap" aria-hidden="true"></span><span class="envelope-pocket" aria-hidden="true"></span>
        <span class="envelope-seal" aria-hidden="true">♡</span><span class="envelope-number">letter ${pad2(index + 1)}</span>
      </button>
      <span class="envelope-caption">${envelope.title}</span><span class="opened-label" aria-live="polite"></span>
    </article>`).join("");
}

const goalStorageKey = "birthday-website-goals-v1";
function setupGoals() {
  const checkboxes = $$("[data-goal-index]");
  let saved = [];
  try {
    const stored = JSON.parse(localStorage.getItem(goalStorageKey) || "[]");
    if (Array.isArray(stored)) saved = stored.filter((index) => Number.isInteger(index) && index >= 0 && index < checkboxes.length);
  } catch (error) {
    console.warn("Saved birthday goals could not be read; starting with an empty list.", error);
  }
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = saved.includes(index);
    checkbox.addEventListener("change", () => {
      const completed = checkboxes.flatMap((item, itemIndex) => item.checked ? [itemIndex] : []);
      try {
        localStorage.setItem(goalStorageKey, JSON.stringify(completed));
      } catch (error) {
        console.error("Birthday goals could not be saved in this browser.", error);
      }
      updateGoalProgress(checkboxes);
    });
  });
  updateGoalProgress(checkboxes);
}

function updateGoalProgress(checkboxes) {
  const complete = checkboxes.filter((checkbox) => checkbox.checked).length;
  const total = checkboxes.length;
  $("#goal-progress-text").textContent = `${complete} of ${total}`;
  $("#goal-progress-bar").setAttribute("aria-valuemax", total);
  $("#goal-progress-bar").setAttribute("aria-valuenow", complete);
  $("#goal-progress-fill").style.width = total ? `${complete / total * 100}%` : "0%";
}

function setupEnvelopes() {
  const dialog = $("#letter-dialog");
  const opened = new Set();
  $$(".envelope-button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.envelopeIndex);
      const envelope = birthdayConfig.envelopes[index];
      if (!envelope) return;
      button.closest(".envelope-card").classList.add("is-open");
      button.closest(".envelope-card").querySelector(".opened-label").textContent = "Opened with love";
      opened.add(index);
      $("#letter-title").textContent = envelope.title;
      $("#letter-body").textContent = envelope.message;
      dialog.showModal();
      if (!button.dataset.confettiDone) {
        button.dataset.confettiDone = "true";
        launchConfetti(18);
      }
    });
  });
  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function setupSecretMessage() {
  const form = $("#secret-form");
  const input = $("#secret-password");
  const feedback = $("#secret-feedback");
  const reveal = $("#secret-reveal");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value.trim().toLocaleLowerCase() !== birthdayConfig.secretPassword.toLocaleLowerCase()) {
      feedback.textContent = "Not quite—try again, lovely. You’ve got this!";
      $("#secret-lock").animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 280 });
      input.select();
      return;
    }
    feedback.textContent = "";
    reveal.textContent = birthdayConfig.secretMessage;
    reveal.hidden = false;
    $(".secret-card").classList.add("is-unlocked");
    form.hidden = true;
    launchConfetti(65);
  });
}

function setupMusic() {
  const audio = $("#background-music");
  const button = $("#music-toggle");
  const label = $(".music-label");
  audio.src = birthdayConfig.musicFile;
  button.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        button.setAttribute("aria-pressed", "true");
        button.setAttribute("aria-label", "Pause birthday music");
        label.textContent = "Pause";
      } catch (error) {
        button.setAttribute("aria-pressed", "false");
        label.textContent = "Music";
        console.warn("Birthday music could not be played. Add a supported audio file at the configured path.", error);
        $("#countdown-message").textContent = "Add your song at the configured music path to hear the birthday soundtrack.";
      }
    } else {
      audio.pause();
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", "Play birthday music");
      label.textContent = "Music";
    }
  });
  audio.addEventListener("error", () => {
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Birthday music unavailable");
    label.textContent = "No song";
  });
  audio.addEventListener("ended", () => {
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Play birthday music");
    label.textContent = "Music";
  });
}

function launchConfetti(count = 50) {
  const colors = ["#f1aac8", "#f7d8a4", "#cfc5f2", "#fff4e8", "#db90b2", "#f6cdb9"];
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.setAttribute("aria-hidden", "true");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.width = `${5 + Math.random() * 7}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;
    piece.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
    piece.style.setProperty("--fall-time", `${2.2 + Math.random() * 2.2}s`);
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 4700);
  }
}

function setupRevealAnimations() {
  const targets = $$(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  targets.forEach((target) => observer.observe(target));
}

function setupCelebration() {
  const birth = parseBirthDate(birthdayConfig.birthDate);
  renderPersonalizedContent();
  updateBirthdayDisplays(birth);
  window.setInterval(() => updateBirthdayDisplays(birth), 1000);
  setupGoals();
  setupEnvelopes();
  setupSecretMessage();
  setupMusic();
  setupRevealAnimations();
  $("#confetti-button").addEventListener("click", () => launchConfetti(100));
}

try {
  setupCelebration();
} catch (error) {
  console.error("Birthday site setup failed. Check the birthdayConfig values.", error);
  $("#countdown-message").textContent = "There’s a small setup issue—please check the birthday date in script.js.";
}
