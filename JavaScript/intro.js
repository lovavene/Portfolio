const root = document.documentElement;
const video = document.getElementById("introVideo");
const hero = document.querySelector(".hero");
const heroImg = document.querySelector(".hero-img");

const REVEAL_AT = 5.5; // seconds: the blue has filled the screen
const FAILSAFE = 10000; // ms: if nothing has happened by then, show the site anyway

// sessionStorage can throw (private mode, blocked storage), so wrap it
function hasSeenIntro() {
  try {
    return sessionStorage.getItem("introSeen") === "1";
  } catch (e) {
    return false;
  }
}
function markIntroSeen() {
  try {
    sessionStorage.setItem("introSeen", "1");
  } catch (e) {}
}

function skip() {
  root.classList.remove("is-intro", "is-locked", "is-revealing");
  if (video) video.remove();
}

function reveal() {
  if (!root.classList.contains("is-intro")) return; // only runs once per load
  markIntroSeen();

  // 1. Start the hero at the image's full, uncropped height
  if (hero && heroImg && heroImg.naturalWidth) {
    hero.style.height =
      (hero.clientWidth * heroImg.naturalHeight) / heroImg.naturalWidth + "px";
    void hero.offsetHeight; // lock that height in before animating
  }

  // 2. Slide the page up and let the hero shrink to 100dvh (the crop)
  root.classList.add("is-revealing");
  root.classList.remove("is-intro");
  if (hero) hero.style.height = "";

  // 3. Clean up when the crop has finished
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    root.classList.remove("is-locked", "is-revealing");
    if (video) video.remove();
  }

  if (hero) {
    hero.addEventListener("transitionend", (e) => {
      if (e.target === hero && e.propertyName === "height") finish();
    });
  }
  setTimeout(finish, 3000); // safety net: keep above your slide duration
}

// Check the video time on every screen refresh
function watch() {
  if (!root.classList.contains("is-intro")) return; // stop looping once revealed or skipped
  if (video.currentTime >= REVEAL_AT) {
    reveal();
    return;
  }
  requestAnimationFrame(watch);
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const forceIntro = location.search.includes("intro"); // open index.html?intro to always play it

if (!video || (!forceIntro && (reduceMotion || hasSeenIntro()))) {
  skip();
} else {
  // If anything stalls (slow network, blocked video), show the site after 10 seconds
  setTimeout(() => {
    if (root.classList.contains("is-intro")) reveal();
  }, FAILSAFE);

  video.addEventListener("playing", () => requestAnimationFrame(watch), {
    once: true,
  });
  video.addEventListener("ended", reveal);
  video.addEventListener("error", skip); // file missing or unsupported

  video.play().catch((err) => {
    console.error("Intro video could not play:", err);
    skip();
  });
}
