const root = document.documentElement;
const video = document.getElementById("introVideo");
const page = document.querySelector(".page");

const REVEAL_AT = 5.6; // seconds: when the blue has filled the screen

function skip() {
  root.classList.remove("is-intro", "is-locked");
  video.remove();
}

function reveal() {
  if (!root.classList.contains("is-intro")) return; // only run once

  root.classList.add("is-revealing");
  root.classList.remove("is-intro"); // triggers the slide-up

  page.addEventListener("transitionend", function done(e) {
    if (e.target !== page || e.propertyName !== "transform") return;
    page.removeEventListener("transitionend", done);
    root.classList.remove("is-locked", "is-revealing"); // normal scrolling
    video.remove();
  });

  sessionStorage.setItem("introSeen", "1");
}

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || sessionStorage.getItem("introSeen")) {
  skip();
} else {
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= REVEAL_AT) reveal();
  });
  video.addEventListener("ended", reveal); // safety net
  video.play().catch(skip); // autoplay blocked: go straight to the site
}
