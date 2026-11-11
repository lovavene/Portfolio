const root = document.documentElement;
const video = document.getElementById("introVideo");
const page = document.querySelector("main");
const hero = document.querySelector(".hero");
const heroImg = document.querySelector(".hero-img");

const REVEAL_AT = 5.3; // seconds: the blue has filled the screen

function skip() {
  root.classList.remove("is-intro", "is-locked");
  video.remove();
}

function reveal() {
  if (!root.classList.contains("is-intro")) return; // only runs once per load

  // 1. Start the hero at the image's full, uncropped height
  if (heroImg.naturalWidth) {
    hero.style.height =
      (hero.clientWidth * heroImg.naturalHeight) / heroImg.naturalWidth + "px";
    void hero.offsetHeight; // lock that height in before animating
  }

  // 2. Slide the page up and let the hero shrink to 100dvh (the crop)
  root.classList.add("is-revealing");
  root.classList.remove("is-intro");
  hero.style.height = "";

  // 3. Clean up when the crop has finished
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    root.classList.remove("is-locked", "is-revealing");
    video.remove();
  }

  hero.addEventListener("transitionend", (e) => {
    if (e.target === hero && e.propertyName === "height") finish();
  });
  setTimeout(finish, 3000); // safety net
}

// Check the video time on every screen refresh (accurate to ~16ms)
function watch() {
  if (video.currentTime >= REVEAL_AT) {
    reveal();
    return;
  }
  if (!video.ended) requestAnimationFrame(watch);
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  skip();
} else {
  video.addEventListener("playing", () => requestAnimationFrame(watch), {
    once: true,
  });
  video.addEventListener("ended", reveal); // safety net

  video.play().catch((err) => {
    console.error("Intro video could not play:", err);
    skip();
  });
}
