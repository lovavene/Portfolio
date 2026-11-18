// the three icons: change a path here if your file names differ
const ICONS = {
  circle: "./Assets/Graphics/circle.png",
  square: "./Assets/Graphics/square.png",
  triangle: "./Assets/Graphics/triangle.png",
};

class DropdownBox extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return; // build only once
    this.dataset.ready = "true";

    // 1. take what you wrote inside the tag: that's the dropdown text
    const content = document.createDocumentFragment();
    while (this.firstChild) content.appendChild(this.firstChild);

    // 2. build the box
    const iconSrc = ICONS[this.getAttribute("icon")];
    this.innerHTML = `
        <button class="dropdown-btn" type="button" aria-expanded="false">
          ${
            iconSrc
              ? `<img class="dropdown-icon" src="${iconSrc}" alt="" />`
              : ""
          }
          <span class="dropdown-label"></span>
        </button>
        <div class="dropdown-panel">
          <div class="dropdown-panel-inner">
            <div class="dropdown-panel-text"></div>
          </div>
        </div>`;

    this.querySelector(".dropdown-label").textContent =
      this.getAttribute("label") || "";
    this.querySelector(".dropdown-panel-text").appendChild(content);

    // 3. open and close
    const button = this.querySelector(".dropdown-btn");
    const canHover = matchMedia("(hover: hover)").matches;

    const setOpen = (isOpen) => {
      this.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", isOpen);
    };

    if (canHover) {
      this.addEventListener("pointerenter", () => setOpen(true));
      this.addEventListener("pointerleave", () => setOpen(false));
    }

    // touch screens and keyboard (Enter/Space): click toggles
    button.addEventListener("click", (e) => {
      if (canHover && e.detail > 0) return; // a mouse click: hover already handles it
      setOpen(!this.classList.contains("is-open"));
    });
  }
}

customElements.define("dropdown-box", DropdownBox);
