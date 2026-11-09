document.querySelectorAll("[data-include]").forEach(async (el) => {
  const response = await fetch(el.dataset.include);
  if (response.ok) {
    el.innerHTML = await response.text();
  } else {
    console.error("Could not load", el.dataset.include);
  }
});
