const GITHUB_USERNAME = "Rexypy";
const MAX_PROJECTS_PER_CATEGORY = 6;
const CATEGORIES = [
  { id: "web", label: "Web", icon: "🕸", topics: ["portfolio-web", "web", "website", "frontend"] },
  { id: "python", label: "Python", icon: "𓆙", topics: ["portfolio-python", "python", "py"] },
  { id: "tools", label: "Tools & Experiments", icon: "☣", topics: ["portfolio-tools", "tools", "automation", "experiment"] },
  { id: "other", label: "Other", icon: "∞", topics: ["portfolio-other", "other"] }
];
const UNDER_CONSTRUCTION_MESSAGES = [
  "Sorry to disappoint, this should only take like 5-ish years.",
  "The developer has entered a staring contest with the TODO list.",
  "Feature delayed due to an unexpected snack break.",
  "Under construction. The construction worker is also under construction.",
  "This project is currently marinating in a folder somewhere.",
  "The roadmap exists. It is mostly arrows pointing vaguely forward.",
  "A prototype was made. It immediately developed opinions.",
  "Loading motivation... still loading motivation...",
  "This is not a bug. It is an empty space with potential.",
  "Development paused for important research. The research was a video essay.",
  "The project is alive, probably. Do not poke it too hard.",
  "A feature request has been submitted to Future Me. No response yet.",
  "Currently held together by hope and one suspicious semicolon.",
  "This slot has been reserved for something brilliant. No pressure.",
  "The code is in its experimental cocoon phase.",
  "Coming soon, assuming time continues moving forward.",
  "The developer is considering it very intensely from across the room.",
  "This idea escaped before it could become a repository.",
  "Status: conceptually complete, physically absent.",
  "A tiny committee is debating variable names. It may take years.",
  "The feature is waiting for a dramatic montage before it can begin.",
  "This project has a healthy fear of deadlines.",
  "One day this will be a real button. Today is not that day.",
  "The build started, then someone asked what the build was for.",
  "This is where the next bad idea will live.",
  "A developer was assigned. The developer wandered off.",
  "Currently converting coffee into architecture diagrams.",
  "The project is buffering at the speed of self-doubt.",
  "Under construction, overthinking, and mildly confused.",
  "This placeholder is doing its best.",
  "The repository name was chosen. That was the easy part.",
  "Progress is being made in a direction. Which direction is classified.",
  "A README is ready. The actual project is catching up.",
  "This feature requires at least one more unnecessary rewrite.",
  "The pixels are being assembled by very small unionised workers.",
  "It worked once. We are trying to recreate the conditions.",
  "This project is currently a very confident empty folder.",
  "The deadline saw us first, so we are hiding.",
  "A bug report was filed before the project existed. Impressive.",
  "The developer is waiting for inspiration to stop being mysterious.",
  "Future functionality pending approval from the tiny dinosaur.",
  "The plan is simple: make thing, regret scope, make thing anyway.",
  "A loading bar would be dishonest, so here is this message instead.",
  "This is only taking longer because it is being made correctly. Maybe.",
  "The feature has entered stealth mode. Even we cannot find it.",
  "An engineer is being summoned via ritual keyboard tapping.",
  "This project is 3% code and 97% deciding what to call it.",
  "The repository is still in the witness protection program.",
  "Work in progress. Emphasis on progress. Eventually.",
  "The next commit is just around the corner. The corner is enormous.",
  "This idea needs a few more tabs open before it can launch.",
  "The build system requested a nap.",
  "A proof of concept exists in the developer's imagination.",
  "The project is currently negotiating with reality.",
  "This feature was postponed for the greater good of snacks.",
  "The codebase is still deciding whether it wants to be elegant or functional.",
  "There is a 50% chance this becomes a game by accident.",
  "The feature is being handcrafted from premium procrastination.",
  "This empty card has more structure than some of my old projects.",
  "The first line of code is waiting for the perfect playlist.",
  "An update is imminent in the geological sense.",
  "This project is in early access to my brain.",
  "The idea has been upgraded from napkin to note app.",
  "The developer said 'just one small feature' and vanished.",
  "Currently untangling a thought that looked easier yesterday.",
  "This is a placeholder with ambitions.",
  "The project is being rendered in real time by anxiety.",
  "A branch was created. It has not yet grown leaves.",
  "This feature is currently powered by vibes.",
  "The task is simple until the implementation begins.",
  "Somewhere, a TODO is quietly getting older.",
  "We have identified the problem. There are now more problems.",
  "The project will be ready shortly after the universe cools down.",
  "This card is a memorial to an idea that was too big for a weekend.",
  "Construction noise has been replaced with thoughtful silence.",
  "The feature is out getting milk. It said it would be right back.",
  "A merge conflict has been predicted by local weather services.",
  "The code is currently fermenting for better flavour.",
  "This project is being assembled with legally distinct duct tape.",
  "The developer has opened the editor. That counts as progress.",
  "This idea requires a whiteboard, three markers, and unrealistic confidence.",
  "A tiny prototype is learning to become a large problem.",
  "This slot is temporarily occupied by a loading excuse.",
  "The feature is not late. It is fashionably compiling.",
  "There is definitely a plan. It is just encrypted.",
  "We are waiting for the code to write itself out of politeness.",
  "The project reached version 0.0.1 emotionally.",
  "An intern was assigned. The intern is also imaginary.",
  "This card is under active consideration by the Department of Maybe.",
  "The next release is scheduled for whenever the stars align.",
  "A breakthrough occurred, then was accidentally closed without saving.",
  "This project is still choosing a personality.",
  "The developer is debugging a thought process.",
  "Feature status: hidden behind a pile of other features.",
  "The keyboard has been consulted. It offered no useful advice.",
  "This is an official notice that something will happen here eventually.",
  "The code has been preheated to an appropriate temperature.",
  "A new idea is loading. Please do not refresh reality.",
  "This project is not missing. It is strategically invisible.",
  "The task list has been sorted by emotional difficulty.",
  "A commit is being prepared somewhere between now and never.",
  "The feature has been approved by nobody, which is very efficient.",
  "We are one good afternoon away from pretending this was planned.",
  "This space is reserved for a future masterpiece or a calculator app.",
  "The project is taking the scenic route to completion.",
  "Nothing to see here yet. Please admire the structural optimism."
];

const categoryRoot = document.querySelector("#projectCategories");
const repoStatus = document.querySelector("#repoStatus");
const refreshProjectsButton = document.querySelector("#refreshProjects");
const dialogueOverlay = document.querySelector("#dialogueOverlay");
const dialogueText = document.querySelector("#dialogueText");
const dialogueName = document.querySelector("#dialogueName");
const dialogueContinue = document.querySelector("#dialogueContinue");
let typingTimer = null;
let fullDialogue = "";
let isTyping = false;
let currentRepoList = [];

let audioContext = null;
let bugMusicTimer = null;
let bugMusicStep = 0;
let bootHum = null;
const bootInterfaceAudio = new Audio("./assets/boot-interface.mp3");
bootInterfaceAudio.preload = "auto";
bootInterfaceAudio.playbackRate = .86;
bootInterfaceAudio.preservesPitch = false;
bootInterfaceAudio.volume = .2;
let audioMuted = true;
try {
  const savedAudioPreference = localStorage.getItem("rexyAudioMuted");
  if (savedAudioPreference !== null) audioMuted = savedAudioPreference === "1";
} catch (_) {}
function enableAudio() {
  if (audioMuted) return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  return audioContext;
}
function updateAudioControls() {
  const label = audioMuted ? "SOUND: OFF" : "SOUND: ON";
  const action = audioMuted ? "Turn sound on" : "Turn sound off";
  const mainToggle = document.querySelector("#audioToggle");
  if (mainToggle) { mainToggle.textContent = label; mainToggle.setAttribute("aria-label", action); }
}
function setAudioMuted(muted) {
  audioMuted = muted;
  try { localStorage.setItem("rexyAudioMuted", muted ? "1" : "0"); } catch (_) {}
  if (muted) { stopBugMusic(); stopBootAmbience(); stopBootInterfaceAudio(); }
  else enableAudio();
  updateAudioControls();
}
function playAudioToggleCue() {
  const context = enableAudio();
  if (!context) return;
  context.resume().then(() => {
    sound({ frequency: 440, duration: .07, volume: .035, type: "sine", slideTo: 660 });
    sound({ frequency: 660, duration: .09, volume: .03, type: "sine", delay: .08, slideTo: 880 });
  }).catch(() => {});
}
function sound({ frequency = 440, duration = .05, volume = .025, type = "square", delay = 0, slideTo = null }) {
  const context = audioContext;
  if (audioMuted || !context || context.state !== "running") return;
  const now = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + .02);
}
function typingSound() { sound({ frequency: 760 + Math.random() * 120, duration: .025, volume: .012, type: "square", slideTo: 520 }); }
function terminalKeySound(key = "") {
  const context = audioContext;
  if (audioMuted || !context || context.state !== "running") return;
  const now = context.currentTime;
  const isReturn = key === "Enter";

  const thock = context.createOscillator();
  const thockGain = context.createGain();
  thock.type = "triangle";
  thock.frequency.setValueAtTime(isReturn ? 92 : 128 + Math.random() * 18, now);
  thock.frequency.exponentialRampToValueAtTime(isReturn ? 58 : 76, now + .026);
  thockGain.gain.setValueAtTime(.0001, now);
  thockGain.gain.exponentialRampToValueAtTime(isReturn ? .05 : .032, now + .002);
  thockGain.gain.exponentialRampToValueAtTime(.0001, now + .032);
  thock.connect(thockGain).connect(context.destination);
  thock.start(now);
  thock.stop(now + .04);

  const noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * .016), context.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
  const click = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const clickGain = context.createGain();
  click.buffer = noiseBuffer;
  filter.type = "bandpass";
  filter.frequency.value = isReturn ? 1500 : 2200;
  filter.Q.value = 1.4;
  clickGain.gain.setValueAtTime(isReturn ? .035 : .022, now + .004);
  clickGain.gain.exponentialRampToValueAtTime(.0001, now + .02);
  click.connect(filter).connect(clickGain).connect(context.destination);
  click.start(now + .004);
  click.stop(now + .025);
}
function bootSound(index) {
  const frequency = 82 + index * 7;
  sound({ frequency, duration: .07, volume: .018, type: "triangle", slideTo: frequency * .9 });
  sound({ frequency: frequency * 1.25, duration: .18, volume: .014, type: "sine", delay: .06, slideTo: frequency * 1.32 });
  if (index === 6) {
    sound({ frequency: 147, duration: .42, volume: .026, type: "sine", delay: .16, slideTo: 156 });
    sound({ frequency: 196, duration: .38, volume: .018, type: "sine", delay: .22, slideTo: 208 });
  }
}
function startBootAmbience() {
  stopBootAmbience();
  const context = enableAudio();
  if (!context) return;
  context.resume().then(() => {
    if (audioMuted || bootHum) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const carrier = context.createOscillator();
    const carrierGain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 58;
    carrier.type = "square";
    carrier.frequency.value = 116;
    gain.gain.value = .0001;
    carrierGain.gain.value = .0001;
    oscillator.connect(gain).connect(context.destination);
    carrier.connect(carrierGain).connect(context.destination);
    oscillator.start();
    carrier.start();
    gain.gain.exponentialRampToValueAtTime(.006, context.currentTime + .35);
    carrierGain.gain.exponentialRampToValueAtTime(.0018, context.currentTime + .35);
    bootHum = { oscillator, gain, carrier, carrierGain };
  }).catch(() => {});
}
function stopBootAmbience() {
  if (!bootHum) return;
  const { oscillator, gain, carrier, carrierGain } = bootHum;
  const context = audioContext;
  if (context && context.state === "running") {
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, .0001), context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .12);
    carrierGain.gain.cancelScheduledValues(context.currentTime);
    carrierGain.gain.setValueAtTime(Math.max(carrierGain.gain.value, .0001), context.currentTime);
    carrierGain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .12);
    oscillator.stop(context.currentTime + .14);
    carrier.stop(context.currentTime + .14);
  } else { oscillator.stop(); carrier.stop(); }
  bootHum = null;
}
function startBootInterfaceAudio() {
  if (audioMuted) return;
  bootInterfaceAudio.pause();
  bootInterfaceAudio.currentTime = 0;
  bootInterfaceAudio.play().catch(() => {});
}
function stopBootInterfaceAudio() {
  bootInterfaceAudio.pause();
  bootInterfaceAudio.currentTime = 0;
}
function startBugMusic() {
  stopBugMusic();
  enableAudio();
  const notes = [220, 262, 294, 330, 294, 262, 196, 220];
  bugMusicStep = 0;
  bugMusicTimer = window.setInterval(() => {
    sound({ frequency: notes[bugMusicStep++ % notes.length], duration: .14, volume: .022, type: "square" });
  }, 210);
}
function stopBugMusic() {
  if (bugMusicTimer) window.clearInterval(bugMusicTimer);
  bugMusicTimer = null;
}
function showDialogue(message, name = "REXY.EXE") {
  enableAudio();
  window.clearInterval(typingTimer);
  fullDialogue = message;
  isTyping = true;
  dialogueName.textContent = name;
  dialogueText.textContent = "";
  dialogueContinue.textContent = "[ SKIP ANIMATION ▸ ]";
  dialogueOverlay.classList.remove("hidden");
  let i = 0;
  typingTimer = window.setInterval(() => {
    dialogueText.textContent += fullDialogue.charAt(i);
    if (i % 2 === 0) typingSound();
    i += 1;
    if (i >= fullDialogue.length) finishTyping();
  }, 30);
}
function finishTyping() {
  window.clearInterval(typingTimer);
  dialogueText.textContent = fullDialogue;
  dialogueContinue.textContent = "[ CLOSE WINDOW ▸ ]";
  isTyping = false;
}
function closeDialogue() {
  window.clearInterval(typingTimer);
  dialogueOverlay.classList.add("hidden");
}
dialogueContinue.addEventListener("click", () => isTyping ? finishTyping() : closeDialogue());
document.querySelector("#dialogueBackdrop").addEventListener("click", closeDialogue);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDialogue(); });

document.querySelector("#themeToggle").addEventListener("click", () => {
  const button = document.querySelector("#themeToggle");
  if (button.dataset.armed === "true") {
    showDialogue("Absolutely not. The dark mode stays.");
    button.textContent = "☼ LIGHT MODE?";
    button.setAttribute("aria-label", "Open the light mode joke");
    button.dataset.armed = "false";
    return;
  }
  showDialogue("You really wanted to switch to light mode?! Reconsider your life choices...");
  button.textContent = "OKAY, DO IT";
  button.dataset.armed = "true";
});

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function normalizedTopics(repo) {
  return (repo.topics || []).map(x => String(x).toLowerCase());
}
function classify(repo) {
  const topics = normalizedTopics(repo);
  for (const cat of CATEGORIES) {
    if (topics.some(t => cat.topics.includes(t))) return cat.id;
  }
  const language = (repo.language || "").toLowerCase();
  if (language === "python") return "python";
  if (["html", "javascript", "typescript", "css", "vue", "svelte"].includes(language)) return "web";
  return "other";
}
function pagesCandidate(repo) {
  if (repo.has_pages) {
    const owner = repo.owner.login;
    const repoName = repo.name;
    return repoName.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? `https://${owner}.github.io/`
      : `https://${owner}.github.io/${repoName}/`;
  }
  return null;
}
async function getPagesUrl(repo) {
  if (!repo.has_pages) return null;
  try {
    const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(GITHUB_USERNAME)}/${encodeURIComponent(repo.name)}/pages`);
    if (!response.ok) return pagesCandidate(repo);
    const data = await response.json();
    return data.html_url || pagesCandidate(repo);
  } catch { return pagesCandidate(repo); }
}
function projectUrl(repo) {
  const category = classify(repo);
  if (category === "web" && repo.has_pages) return pagesCandidate(repo) || repo.html_url;
  return `${repo.html_url}/tree/${encodeURIComponent(repo.default_branch || "main")}`;
}
function makeProjectCard(repo, category) {
  const url = projectUrl(repo);
  const updated = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "Unknown";
  return `<a class="project-card" href="${esc(url)}" target="_blank" rel="noreferrer">
    <span class="card-kicker">${esc(category.label)} / repository</span>
    <h3>${esc(repo.name)}</h3>
    <p class="description">${esc(repo.description || "No description yet. The mystery is part of the experience.")}</p>
    <div class="card-bottom"><span class="language">${esc(repo.language || "Unclassified")}</span><span>UPDATED ${esc(updated)} ↗</span></div>
  </a>`;
}
function makePlaceholder(category, index) {
  return `<button class="project-card placeholder text-left" data-placeholder="${index}" data-category="${esc(category.label)}" type="button">
    <span class="self-start tape">UNDER CONSTRUCTION</span>
    <h3 class="mt-4">Coming eventually™</h3>
    <p class="description">A very real project-shaped hole. Check back after a few geological eras.</p>
    <div class="card-bottom"><span>STATUS: MAYBE</span><span>DO NOT SHAKE</span></div>
  </button>`;
}
function renderProjects(repos, animate = false) {
  const buckets = Object.fromEntries(CATEGORIES.map(c => [c.id, []]));
  repos.filter(r => !r.fork && !r.archived).forEach(repo => buckets[classify(repo)].push(repo));
  categoryRoot.innerHTML = CATEGORIES.map(category => {
    const list = buckets[category.id].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, MAX_PROJECTS_PER_CATEGORY);
    const cards = list.map(repo => makeProjectCard(repo, category)).join("");
    const placeholders = Array.from({ length: Math.max(0, MAX_PROJECTS_PER_CATEGORY - list.length) }, (_, i) => makePlaceholder(category, i)).join("");
    return `<section aria-labelledby="heading-${category.id}">
      <div class="category-heading"><h3 class="category-title" id="heading-${category.id}"><span class="mr-2 text-acid">${category.icon}</span>${esc(category.label)}</h3><span class="category-count">${list.length} PROJECT${list.length === 1 ? "" : "S"} / 06</span></div>
      <div class="project-grid">${cards}${placeholders}</div>
    </section>`;
  }).join("");
  categoryRoot.querySelectorAll("[data-placeholder]").forEach(button => button.addEventListener("click", () => {
    const message = UNDER_CONSTRUCTION_MESSAGES[Math.floor(Math.random() * UNDER_CONSTRUCTION_MESSAGES.length)];
    showDialogue(message, "PROJECT STATUS: HONEST");
  }));
  if (animate) {
    categoryRoot.querySelectorAll(".project-card").forEach((card, index) => {
      card.classList.add("scan-reveal");
      card.style.animationDelay = `${index * 55}ms`;
    });
  }
}
function showScanLoading() {
  categoryRoot.innerHTML = `<div class="scan-loading" aria-label="Scanning repositories"><span></span><span></span><span></span></div>`;
}
async function loadProjects({ animate = false } = {}) {
  if (!GITHUB_USERNAME || GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
    repoStatus.textContent = "SET GITHUB_USERNAME IN script.js";
    categoryRoot.innerHTML = "";
    renderProjects([]);
    return;
  }
  if (animate) {
    refreshProjectsButton.disabled = true;
    refreshProjectsButton.classList.add("is-scanning");
    refreshProjectsButton.textContent = "↻ SCANNING…";
    showScanLoading();
  }
  repoStatus.textContent = "SCANNING PUBLIC REPOSITORIES…";
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated`, {
      headers: { "Accept": "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(response.status === 404 ? "GitHub user not found." : `GitHub API returned ${response.status}.`);
    const repos = await response.json();
    currentRepoList = repos;
    renderProjects(repos, animate);
    const total = repos.filter(r => !r.fork && !r.archived).length;
    repoStatus.textContent = `${total} REPOSITORIES FOUND · LIVE FROM GITHUB`;
    const webRepos = repos.filter(r => classify(r) === "web" && r.has_pages);
    await Promise.all(webRepos.map(async repo => {
      const url = await getPagesUrl(repo);
      if (!url) return;
      const cards = [...categoryRoot.querySelectorAll("a.project-card")];
      const card = cards.find(a => a.querySelector("h3")?.textContent === repo.name);
      if (card) card.href = url;
    }));
  } catch (error) {
    repoStatus.textContent = "COULD NOT CONNECT";
    categoryRoot.innerHTML = `<div class="rounded-xl border border-red-900/70 bg-red-950/20 p-5 text-sm text-zinc-300"><p class="font-mono text-red-400">GITHUB LINK FAILED</p><p class="mt-2">${esc(error.message || "Unknown error")}</p><p class="mt-2 text-zinc-500">Check your username, connection, or GitHub API rate limit.</p></div>`;
  } finally {
    if (animate) {
      refreshProjectsButton.disabled = false;
      refreshProjectsButton.classList.remove("is-scanning");
      refreshProjectsButton.textContent = "↻ RE-SCAN REPOSITORIES";
    }
  }
}
refreshProjectsButton.addEventListener("click", () => loadProjects({ animate: true }));
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#githubProfileLink").href = `https://github.com/${GITHUB_USERNAME}`;
loadProjects();


const RANDOM_FACTS = [
  "A day on Venus is longer than its year.",
  "Octopuses have three hearts. Two help move blood to the gills.",
  "The smell after rain is called petrichor.",
  "There are more possible chess games than atoms in the observable universe.",
  "A group of flamingos is called a flamboyance.",
  "Some turtles can breathe through specialized tissue near their rear end. Nature is weird.",
  "Bananas are naturally slightly radioactive because they contain high levels of potassium.",
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that is still edible.",
  "Wombat poop is cube-shaped, which keeps it from rolling away.",
  "Oxford University is older than the Aztec Empire.",
  "Sharks existed before trees—and before Saturn had its rings.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.",
  "Nintendo was founded in 1889 as a playing card company.",
  "Sea otters hold hands while sleeping so they don't float away from each other.",
  "Cows have best friends and get stressed out when they are separated.",
  "Sloths can hold their breath underwater longer than dolphins can.",
  "A single cloud can weigh more than 1 million pounds.",
  "Pineapples take nearly two years to grow.",
  "If you leave a glass of water sitting out, every molecule in it has likely passed through a dinosaur.",
  "Scotland's national animal is the unicorn.",
  "The world’s quietest room is so quiet you can hear your own heart beating and your bones grinding.",
  "Butterflies taste things with their feet.",
  "A nightingale’s song can drown out the sound of a passing lawnmower.",
  "Human teeth are the only part of the body that cannot heal themselves.",
  "There are more fake plastic flamingos in the world than real ones.",
  "The Eiffel Tower can grow up to 6 inches taller during summer due to thermal expansion.",
  "Strawberries aren't actual berries, but bananas, watermelons, and pumpkins are.",
  "Pigeons can be taught to tell the difference between paintings by Monet and Picasso.",
  "Sound travels about four times faster in water than it does in air.",
  "The inventors of the bubble wrap originally tried to sell it as textured wallpaper.",
  "A leap year isn't every 4 years: years divisible by 100 aren't leap years unless divisible by 400.",
  "Koalas have fingerprints that are almost indistinguishable from human fingerprints.",
  "It rains diamonds on Saturn and Jupiter.",
  "Pluto was discovered in 1930 and hasn't made a full orbit around the Sun since.",
  "Hot water freezes faster than cold water under certain conditions (the Mpemba effect).",
  "Peanuts aren't nuts; they're legumes that grow underground.",
  "Your brain uses about 20% of your body's total oxygen and energy.",
  "The dot over the letter 'i' or 'j' is called a tittle.",
  "Cats can't taste sweetness due to a genetic mutation.",
  "There is enough gold inside Earth's core to coat the entire surface of the planet in 1.5 feet of gold.",
  "Hippo sweat acts as a natural sunscreen and is reddish-pink in color.",
  "Dolphins give each other unique names through specific signature whistles.",
  "The wood frog can freeze solid during winter and thaw back out alive in spring.",
  "Antarctica is technically the world's largest desert.",
  "Mantis shrimp can punch with the speed of a bullet, boiling the water around them.",
  "An individual snowflake can take up to two hours to fall to the ground.",
  "The unicorn sea creature, the narwhal, actually has an overgrown canine tooth, not a horn.",
  "A day on Mars is only 39 minutes longer than a day on Earth.",
  "High heels were originally created for men, specifically Persian horse riders, in the 10th century.",
  "Your stomach has to produce a new layer of mucus every two weeks so it doesn't digest itself.",
  "Ketchup was sold as medicine in the 1830s to cure diarrhea and indigestion.",
  "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
  "Jellyfish are 95% water and have no brain, heart, or blood.",
  "Polar bear skin is actually black, and their fur is clear/hollow, not white.",
  "Astronauts grow up to 2 inches taller while in space because microgravity decompresses the spine.",
  "Lighter fluid was invented before matches.",
  "Rabbits can't vomit, which makes hairballs particularly dangerous for them.",
  "The tongue of a blue whale weighs as much as an entire adult elephant.",
  "Tigers have striped skin, not just striped fur.",
  "Apples, pears, and plums belong to the rose family.",
  "The moon has moonquakes caused by gravitational tidal pulls from Earth.",
  "A group of crows is called a murder, while a group of owls is a parliament.",
  "The average person spends about 6 months of their life waiting for red lights to turn green.",
  "You can't hum while holding your nose closed. (You just tried it, didn't you?)",
  "The length from your wrist to your inner elbow is roughly equal to the length of your foot.",
  "Goats have rectangular pupils, giving them a 320-degree field of vision without moving.",
  "Mount Everest grows about 4 millimeters higher every year.",
  "A single strand of spider silk is stronger than a steel wire of the same thickness.",
  "The original name for the Search engine Google was 'BackRub'.",
  "The blue whale's heart is the size of a small car like a Volkswagen Beetle.",
  "Lobsters don't die of old age; they continuously grow and produce shell-building enzymes forever.",
  "In 1913, the US Post Office allowed people to legally mail children if they weighed under 11 pounds.",
  "Earth is the only planet in our solar system not named after a Greek or Roman deity.",
  "Firefighters use wetting agents to make water 'wetter' so it penetrates fires faster.",
  "Squirreling trees: squirrels accidentally plant millions of trees every year by forgetting where they buried nuts.",
  "The Hawaiian alphabet contains only 12 letters.",
  "Dragonflies have been around for over 300 million years, predating dinosaurs.",
  "Chainsaws were originally invented in 1785 to assist in difficult childbirths.",
  "The total weight of all ants on Earth is estimated to equal or exceed the weight of all humans.",
  "A 'jiffy' is an actual unit of time: 1/100th of a second (or light's travel time over 1 centimeter).",
  "Vending machines kill more people annually than sharks do.",
  "A group of hedgehogs is called an 'array'.",
  "Before toilet paper was invented, Americans used corn cobs or old mail-order catalogs.",
  "Sea cucumbers squirt their internal organs out of their rear to deter predators, then regrow them.",
  "The national flag of Nepal is the only non-rectangular national flag in the world.",
  "Pigs can't look directly up into the sky due to their neck anatomy.",
  "The world's smallest reptile, a tiny chameleon discovered in Madagascar, fits on a fingertip.",
  "Reno, Nevada is farther west than Los Angeles, California.",
  "Cranberries bounce like rubber balls when they are ripe.",
  "Sperm whales communicate in regional dialects depending on which ocean pod they belong to.",
  "The fear of long words is ironically named hippopotomonstrosesquippedaliophobia.",
  "A single honeybee produces only about 1/12th of a teaspoon of honey in its entire life.",
  "Sound cannot travel through a vacuum, meaning space is entirely silent.",
  "Almonds are seeds, not true botanical nuts.",
  "Your eyes remain the same size from birth, but your nose and ears never stop growing.",
  "The Spanish national anthem has no official lyrics.",
  "The surface area of a pair of human lungs is roughly the size of a tennis court.",
  "Giraffes have the same number of neck vertebrae as humans (seven).",
  "The average adult human body contains enough iron to forge a 3-inch nail.",
  "Venus is the only planet in our solar system that spins clockwise."
];

const bootOverlay = document.querySelector("#bootOverlay");
const bootLines = document.querySelector("#bootLines");
const bootProgress = document.querySelector("#bootProgress");
const bootSkip = document.querySelector("#bootSkip");
const bootAudioPrompt = document.querySelector("#bootAudioPrompt");
const bootAudioOn = document.querySelector("#bootAudioOn");
const bootAudioOff = document.querySelector("#bootAudioOff");
const BOOT_STORAGE_KEY = "rexyBootSeen";
const BOOT_LINE_DELAY = 850;
const shooterOverlay = document.querySelector("#shooterOverlay");
const canvas = document.querySelector("#shooterCanvas");
const ctx = canvas.getContext("2d");
let bootTimer = null;
let bootIndex = 0;
const bootMessages = [
  "REXY BIOS v0.0.∞",
  "Checking motivation........ [NOT FOUND]",
  "Loading questionable ideas.. [OK]",
  "Compiling dinosaur noises... [OK]",
  "Searching for semicolons..... [OK]",
  "Initializing tiny spaceship. [OK]",
  "Launching portfolio.......... [SUCCESS]"
];

function finishBoot() {
  clearInterval(bootTimer);
  stopBootAmbience();
  stopBootInterfaceAudio();
  bootOverlay.classList.add("hidden");
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  window.scrollTo(0, 0);
  requestAnimationFrame(() => window.scrollTo(0, 0));
  try { localStorage.setItem(BOOT_STORAGE_KEY, "1"); } catch (_) {}
}
function startBoot(force = false) {
  let seen = false;
  try {
    seen = localStorage.getItem(BOOT_STORAGE_KEY) === "1";
  } catch (_) {}
  if (seen && !force) return;
  clearInterval(bootTimer);
  bootOverlay.classList.remove("hidden");
  bootLines.textContent = "";
  bootProgress.style.width = "0%";
  bootIndex = 0;
  bootAudioPrompt.hidden = false;
  bootSkip.hidden = true;
}
function beginBootSequence() {
  bootAudioPrompt.hidden = true;
  bootSkip.hidden = false;
  bootTimer = setInterval(() => {
    if (bootIndex >= bootMessages.length) {
      clearInterval(bootTimer);
      bootSkip.textContent = "[ ENTER THE PORTFOLIO ▸ ]";
      setTimeout(finishBoot, 550);
      return;
    }
    const line = bootMessages[bootIndex];
    const span = document.createElement("div");
    span.textContent = line;
    if (line.includes("[OK]") || line.includes("[SUCCESS]")) span.className = "ok";
    bootLines.appendChild(span);
    bootSound(bootIndex);
    bootProgress.style.width = `${Math.round(((bootIndex + 1) / bootMessages.length) * 100)}%`;
    bootIndex++;
  }, BOOT_LINE_DELAY);
}
window.addEventListener("load", () => setTimeout(startBoot, 220));
bootSkip.addEventListener("click", finishBoot);
bootAudioOn.addEventListener("click", () => { setAudioMuted(false); startBootAmbience(); startBootInterfaceAudio(); beginBootSequence(); });
bootAudioOff.addEventListener("click", () => { setAudioMuted(true); beginBootSequence(); });
document.querySelector("#audioToggle").addEventListener("click", () => {
  setAudioMuted(!audioMuted);
  if (!audioMuted) playAudioToggleCue();
});
updateAudioControls();

document.querySelector("#treasureButton").addEventListener("click", () => {
  const fact = RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)];
  showDialogue(`SECRET FOUND. Random fact: ${fact}`, "HIDDEN TREASURE");
});

function launchShooter() {
  shooterOverlay.classList.remove("hidden");
  resetShooter();
  requestAnimationFrame(() => document.querySelector("#gameClose").focus());
}
document.querySelector("#bugStatus").addEventListener("click", launchShooter);
document.querySelector("#gameClose").addEventListener("click", () => {
  shooterOverlay.classList.add("hidden");
  game.running = false;
  stopBugMusic();
});
shooterOverlay.addEventListener("click", e => {
  if (e.target === shooterOverlay) {
    shooterOverlay.classList.add("hidden");
    game.running = false;
    stopBugMusic();
  }
});
document.querySelector("#gameRestart").addEventListener("click", resetShooter);

const game = { running: false, score: 0, playerX: 320, bullets: [], enemies: [], keys: new Set(), lastShot: 0, lastFrame: 0, raf: 0, won: false };
function resetShooter() {
  cancelAnimationFrame(game.raf);
  startBugMusic();
  game.score = 0; game.playerX = canvas.width / 2; game.bullets = []; game.keys.clear();
  game.enemies = Array.from({length: 8}, (_, i) => ({ x: 55 + (i % 4) * 170, y: 45 + Math.floor(i / 4) * 65, alive: true, phase: i * 1.4 }));
  game.running = true; game.won = false; game.lastFrame = 0;
  document.querySelector("#gameStatus").textContent = "SCORE: 0 / 8";
  game.raf = requestAnimationFrame(drawShooter);
}
function shoot() {
  const now = performance.now();
  if (now - game.lastShot > 220 && game.running) {
    game.bullets.push({ x: game.playerX, y: canvas.height - 47 });
    game.lastShot = now;
  }
}
function drawShooter(timestamp) {
  if (!game.running || shooterOverlay.classList.contains("hidden")) return;
  const dt = Math.min(32, timestamp - (game.lastFrame || timestamp));
  game.lastFrame = timestamp;
  if (game.keys.has("ArrowLeft") || game.keys.has("a")) game.playerX -= dt * .32;
  if (game.keys.has("ArrowRight") || game.keys.has("d")) game.playerX += dt * .32;
  game.playerX = Math.max(18, Math.min(canvas.width - 18, game.playerX));
  if (game.keys.has(" ")) shoot();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#030604"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 44; i++) {
    ctx.fillStyle = i % 5 === 0 ? "#65ff35" : "#334335";
    ctx.fillRect((i * 137) % canvas.width, (i * 79 + Math.floor(timestamp * .018)) % canvas.height, 2, 2);
  }
  ctx.fillStyle = "#65ff35";
  ctx.beginPath(); ctx.moveTo(game.playerX, canvas.height - 48); ctx.lineTo(game.playerX - 15, canvas.height - 22); ctx.lineTo(game.playerX, canvas.height - 28); ctx.lineTo(game.playerX + 15, canvas.height - 22); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#c8ffc0"; ctx.fillRect(game.playerX - 2, canvas.height - 39, 4, 8);
  game.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    enemy.x += Math.sin(timestamp * .0012 + enemy.phase) * .15 * dt;
    ctx.strokeStyle = "#ff4545"; ctx.lineWidth = 2;
    ctx.strokeRect(enemy.x - 11, enemy.y - 8, 22, 16);
    ctx.fillStyle = "#ff4545"; ctx.fillRect(enemy.x - 5, enemy.y - 3, 3, 3); ctx.fillRect(enemy.x + 3, enemy.y - 3, 3, 3);
    ctx.fillRect(enemy.x - 7, enemy.y + 4, 14, 2);
  });
  game.bullets = game.bullets.filter(b => b.y > 0);
  game.bullets.forEach(b => {
    b.y -= dt * .52; ctx.fillStyle = "#65ff35"; ctx.fillRect(b.x - 2, b.y, 4, 10);
    game.enemies.forEach(enemy => {
      if (enemy.alive && Math.abs(b.x - enemy.x) < 17 && Math.abs(b.y - enemy.y) < 16) {
        enemy.alive = false; b.y = -10; game.score++;
      }
    });
  });
  document.querySelector("#gameStatus").textContent = `SCORE: ${game.score} / ${game.enemies.length}`;
  if (game.enemies.every(e => !e.alive)) {
    game.running = false; game.won = true;
    stopBugMusic();
    ctx.fillStyle = "rgba(3,6,4,.82)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#65ff35"; ctx.textAlign = "center"; ctx.font = "bold 24px monospace";
    ctx.fillText("BUGS ELIMINATED", canvas.width / 2, canvas.height / 2 - 5);
    ctx.font = "12px monospace"; ctx.fillText("Your code is still not guaranteed to work.", canvas.width / 2, canvas.height / 2 + 22);
    return;
  }
  game.raf = requestAnimationFrame(drawShooter);
}
window.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", " "].includes(e.key) && !shooterOverlay.classList.contains("hidden")) e.preventDefault();
  if (e.key === "Escape" && !shooterOverlay.classList.contains("hidden")) {
    shooterOverlay.classList.add("hidden"); game.running = false; stopBugMusic();
  }
  if (!shooterOverlay.classList.contains("hidden")) {
    game.keys.add(e.key);
    if (e.key === " ") shoot();
  }
  if (e.key === "~" && !e.repeat) openTerminal();
});
window.addEventListener("keyup", e => game.keys.delete(e.key));
function bindGameButton(id, key) {
  const button = document.querySelector(id);
  if (!button) return;
  const down = e => { e.preventDefault(); game.keys.add(key); if (key === " ") shoot(); };
  const up = e => { e.preventDefault(); game.keys.delete(key); };
  button.addEventListener("pointerdown", down);
  button.addEventListener("pointerup", up);
  button.addEventListener("pointerleave", up);
  button.addEventListener("pointercancel", up);
}
bindGameButton("#gameLeft", "ArrowLeft");
bindGameButton("#gameRight", "ArrowRight");
bindGameButton("#gameFire", " ");

const terminalOverlay = document.createElement("div");
terminalOverlay.id = "terminalOverlay";
terminalOverlay.className = "terminal-overlay hidden";
terminalOverlay.innerHTML = `
  <section class="terminal-panel" role="dialog" aria-modal="true" aria-label="Secret terminal">
    <div class="terminal-header"><span>REXY SHELL // UNDOCUMENTED</span><button id="terminalClose" type="button">[ ESC ]</button></div>
    <div id="terminalOutput" class="terminal-output">Welcome, suspicious person.\nType <span style="color:#65ff35">help</span> to inspect available commands.</div>
    <form id="terminalForm" class="terminal-form"><label for="terminalInput">rexy@portfolio:~$</label><input id="terminalInput" autocomplete="off" spellcheck="false" aria-label="Terminal command" /><button type="submit">RUN</button></form>
  </section>`;
document.body.appendChild(terminalOverlay);

const terminalOutput = terminalOverlay.querySelector("#terminalOutput");
const terminalInput = terminalOverlay.querySelector("#terminalInput");

terminalInput.addEventListener("keydown", e => {
  if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
    enableAudio();
    terminalKeySound(e.key);
  }
});

function openTerminal() {
  terminalOverlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.focus();
  });
}

function closeTerminal() { terminalOverlay.classList.add("hidden"); }

document.querySelector("#terminalHint").addEventListener("click", openTerminal);
terminalOverlay.querySelector("#terminalClose").addEventListener("click", closeTerminal);
terminalOverlay.addEventListener("click", e => { if (e.target === terminalOverlay) closeTerminal(); });

function terminalPrint(text) {
  const line = document.createElement("div");
  line.textContent = text;
  terminalOutput.appendChild(line);
  requestAnimationFrame(() => { terminalOutput.scrollTop = terminalOutput.scrollHeight; });
}

function terminalPrintProjects() {
  const projects = currentRepoList
    .filter(repo => !repo.fork && !repo.archived)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!projects.length) {
    terminalPrint("ProjectVault is still loading. Try again in a moment.");
    return;
  }
  const heading = document.createElement("div");
  heading.className = "terminal-directory-heading";
  heading.textContent = "Directory of ProjectVault";
  terminalOutput.appendChild(heading);
  projects.forEach(repo => {
    const link = document.createElement("a");
    link.className = "terminal-project-link";
    link.href = projectUrl(repo);
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `ProjectVault/${repo.name}`;
    terminalOutput.appendChild(link);
  });
  requestAnimationFrame(() => { terminalOutput.scrollTop = terminalOutput.scrollHeight; });
}

terminalOverlay.querySelector("#terminalForm").addEventListener("submit", e => {
  e.preventDefault();
  const command = terminalInput.value.trim().toLowerCase();
  if (!command) return;

  terminalPrint(`rexy@portfolio:~$ ${command}`);
  terminalInput.value = "";

  const commands = {
    help: "Commands: help, dir, cls, whoami, skills, coffee, sudo coffee, rm -rf procrastination, launch shooter, fact, git blame, hack, matrix, reboot",
    whoami: "Guest User. Though in your heart, you know you are a bug finder.",
    skills: "Loaded Modules: C, Python, HTML, JavaScript, CSS and 99% StackOverflow search capabilities.",
    coffee: "Permission denied: caffeine privileges are reserved for the developer.",
    "sudo coffee": "Brewing... ☕ Error 418: I'm a teapot.",
    "rm -rf procrastination": "Nice try. Procrastination is a protected system dependency.",
    "rm -rf /": "Access denied: No you dont! Leave the root system intact!",
    "git blame": "100% of the commits belong to the developer. The bugs belong to cosmic radiation.",
    hack: "Accessing mainframe... 01001000 01001001! (Access Denied: Why would you think this works? I literally wrote this...)",
    matrix: "Entering the matrix... Wake up, Neo...",
    "launch shooter": "Launching Bug Invaders…",
    fact: () => `RANDOM FACT: ${RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)]}`,
    reboot: "Restarting Rexy.exe…"
  };

  if (command === "cls") {
    terminalOutput.textContent = "";
    terminalOutput.scrollTop = 0;
  }
  else if (command === "dir") {
    terminalPrintProjects();
  }
  else if (command === "launch shooter") {
    terminalPrint(commands[command]);
    closeTerminal();
    launchShooter();
  }
  else if (command === "reboot") {
    terminalPrint(commands[command]);
    closeTerminal();
    startBoot(true);
  }
  else if (command.startsWith("sudo")) {
    terminalPrint("Permission denied: You hold no root authority in Rexy Shell.");
  }
  else if (commands[command]) {
    const result = typeof commands[command] === "function" ? commands[command]() : commands[command];
    terminalPrint(result);
  }
  else {
    terminalPrint(`Command not found: ${command}. Try 'help'.`);
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !terminalOverlay.classList.contains("hidden")) {
    e.preventDefault();
    closeTerminal();
  }
});

let interactionCount = 0;
let lastFakeCrash = 0;
document.addEventListener("click", e => {
  if (e.target.closest("button, a, input, form, .dialogue-overlay, .game-overlay, .terminal-overlay, .boot-overlay")) return;
  interactionCount++;
  const now = Date.now();
  if (interactionCount >= 11 && now - lastFakeCrash > 60000) {
    interactionCount = 0;
    lastFakeCrash = now;
    showDialogue("CRITICAL ERROR: Rexy.exe has stopped making sense. Attempting to recover the developer... Recovery complete. This was a feature.", "SYSTEM FAILURE");
  }
});
