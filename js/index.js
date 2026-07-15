/* ==========================================================
   THE BEAN & BAR — Menu Script  (powered by KSS_ENGINE)
   ========================================================== */

/* ── 1. Engine boot ────────────────────────────────────── */
KSS_ENGINE.init({
  serviceId: "66d751cc2dfd45c14807f7cf",
  type: "menu",
  filterEmpty: true,
  fallbackPath: "./data/menu.json",
  fallbackOnly: false,
});

/* ── 2. Error handling ─────────────────────────────────── */
KSS_ENGINE.error.subscribe(function (err) {
  if (!err) return;
  var overlay = document.getElementById("loader-overlay");
  if (overlay) {
    var spinner = overlay.querySelector(".loader-spinner");
    var text = overlay.querySelector(".loader-text");
    if (spinner) spinner.style.display = "none";
    if (text) text.textContent = "Failed to load menu. Please refresh.";
  }
});

/* ── 3. Image preview handling ─────────────────────────── */
const IMAGE_PREVIEW_STATE_KEY = "menuImagePreview";
let imagePreviewElements = null;

function ensureImagePreview() {
  if (imagePreviewElements) {
    return imagePreviewElements;
  }

  const overlay = document.createElement("div");
  overlay.className = "image-preview-overlay";
  overlay.setAttribute("hidden", "hidden");
  overlay.setAttribute("aria-hidden", "true");

  const dialog = document.createElement("div");
  dialog.className = "image-preview-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Image preview");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "image-preview-close";
  closeButton.setAttribute("aria-label", "Close image preview");
  closeButton.textContent = "Close";

  const image = document.createElement("img");
  image.className = "image-preview-image";
  image.alt = "";

  dialog.appendChild(closeButton);
  dialog.appendChild(image);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeImagePreview();
    }
  });

  closeButton.addEventListener("click", function () {
    closeImagePreview();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isImagePreviewOpen()) {
      closeImagePreview();
    }
  });

  window.addEventListener("popstate", function () {
    if (!isImagePreviewOpen()) {
      return;
    }

    hideImagePreview();
  });

  imagePreviewElements = {
    overlay,
    image,
    closeButton,
  };

  return imagePreviewElements;
}

function isImagePreviewOpen() {
  return !!(
    imagePreviewElements && !imagePreviewElements.overlay.hasAttribute("hidden")
  );
}

function hasPreviewHistoryState() {
  return !!(history.state && history.state[IMAGE_PREVIEW_STATE_KEY]);
}

function openImagePreview(src, alt) {
  if (!src) {
    return;
  }

  const preview = ensureImagePreview();
  preview.image.src = src;
  preview.image.alt = alt || "Preview image";
  preview.overlay.removeAttribute("hidden");
  preview.overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("image-preview-open");

  if (!hasPreviewHistoryState()) {
    history.pushState(
      Object.assign({}, history.state, {
        [IMAGE_PREVIEW_STATE_KEY]: true,
      }),
      "",
    );
  }

  preview.closeButton.focus();
}

function hideImagePreview() {
  if (!imagePreviewElements) {
    return;
  }

  imagePreviewElements.overlay.setAttribute("hidden", "hidden");
  imagePreviewElements.overlay.setAttribute("aria-hidden", "true");
  imagePreviewElements.image.removeAttribute("src");
  imagePreviewElements.image.alt = "";
  document.body.classList.remove("image-preview-open");
}

function closeImagePreview() {
  if (!isImagePreviewOpen()) {
    return;
  }

  if (hasPreviewHistoryState()) {
    hideImagePreview();
    history.back();
    return;
  }

  hideImagePreview();
}

function createPreviewTrigger(imageSrc, imageAlt, className) {
  const trigger = document.createElement("button");
  const previewImage = document.createElement("img");

  trigger.type = "button";
  trigger.className = className;
  trigger.setAttribute("aria-label", `Preview ${imageAlt}`);

  previewImage.src = imageSrc;
  previewImage.alt = imageAlt;
  previewImage.loading = "lazy";

  trigger.appendChild(previewImage);
  trigger.addEventListener("click", function () {
    openImagePreview(imageSrc, imageAlt);
  });

  return trigger;
}

/* ── 3. Build UI when data is ready ────────────────────── */
KSS_ENGINE.onReady(function (menuData) {
  var store = menuData.store;
  KSS_ENGINE.setupPageMeta(store);
  ensureImagePreview();

  addMenuInfo(store);
  createMenu(menuData.categories, store);

  KSS_ENGINE.waitForImages().then(function () {
    hideLoader();
  });
});

/* ── Hide loader & show content ────────────────────────── */
function hideLoader() {
  var container = document.getElementById("menu-container");
  var overlay = document.getElementById("loader-overlay");
  if (container) container.style.display = "";
  if (!overlay) return;
  overlay.classList.add("hidden");
  setTimeout(function () {
    overlay.remove();
  }, 550);
}

/* ── Menu info / header ────────────────────────────────── */
function addMenuInfo(store) {
  const startYear = 2022;
  const currentYear = new Date().getFullYear();
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.innerHTML = `&copy; ${startYear} - ${currentYear} &nbsp;|&nbsp; Powered by`;
  }

  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  const header = document.createElement("div");
  header.className = "store-header";

  if (store.storeLogo) {
    header.innerHTML += `<img src="${store.storeLogo}" alt="Store Logo">`;
  } else {
    header.innerHTML += `<h1>${store.storeName}</h1>`;
  }

  if (store.aboutUs) {
    header.innerHTML += `<p>${store.aboutUs}</p>`;
  }

  container.appendChild(header);
  const social = store.sm;

  if (social) {
    const socialDiv = document.createElement("div");
    socialDiv.className = "store-social";

    if (social.instagramUrl) {
      socialDiv.innerHTML += `
        <a href="${social.instagramUrl}" target="_blank" title="${social.instagramName || "Instagram"}" aria-label="${social.instagramName || "Instagram"}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
        </a>
      `;
    }

    if (social.instagram2Url) {
      socialDiv.innerHTML += `
        <a href="${social.instagram2Url}" target="_blank" title="${social.instagram2Name || "Instagram"}" aria-label="${social.instagram2Name || "Instagram"}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
        </a>
      `;
    }

    if (social.facebookUrl) {
      socialDiv.innerHTML += `
        <a href="${social.facebookUrl}" target="_blank" title="${social.facebookName || "Facebook"}" aria-label="${social.facebookName || "Facebook"}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
        </a>
      `;
    }

    if (social.facebook2Url) {
      socialDiv.innerHTML += `
        <a href="${social.facebook2Url}" target="_blank" title="${social.facebook2Name || "Facebook"}" aria-label="${social.facebook2Name || "Facebook"}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
        </a>
      `;
    }

    if (social.whatsappUrl) {
      socialDiv.innerHTML += `
        <a href="${social.whatsappUrl}" target="_blank" title="WhatsApp" aria-label="WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
        </a>
      `;
    }

    if (social.locationUrl) {
      socialDiv.innerHTML += `
        <a href="${social.locationUrl}" target="_blank" title="Location" aria-label="Location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>
        </a>
      `;
    }

    // Phone number as icon like others
    if (store.displayedPhoneNumber && store.phoneNumber) {
      socialDiv.innerHTML += `
        <a href="tel:${store.phoneNumber}" title="Call ${store.displayedPhoneNumber}" aria-label="Call">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/></svg>
        </a>
      `;
    }

    container.appendChild(header);
    header.appendChild(socialDiv);
  }
}

/* ── Create menu ───────────────────────────────────────── */
function createMenu(categoriesArray, store) {
  const currency = store?.currency || "$";
  const container = document.getElementById("menu-container");

  function applyArabicNumerals(value) {
    if (value == null) {
      return "";
    }

    const arabicDigits = {
      0: "٠",
      1: "١",
      2: "٢",
      3: "٣",
      4: "٤",
      5: "٥",
      6: "٦",
      7: "٧",
      8: "٨",
      9: "٩",
    };

    return String(value).replace(/\d/g, function (digit) {
      return arabicDigits[digit] || digit;
    });
  }

  function formatItemPrice(value, isArabic) {
    if (value == null) {
      return "";
    }

    const formattedValue = `${currency} ${value}`;
    return isArabic ? applyArabicNumerals(formattedValue) : formattedValue;
  }

  function hasPriceValue(value) {
    return value != null && `${value}`.trim() !== "";
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getDisplayItemLabel(label, sizeLabels, usesSizes) {
    if (!usesSizes || !Array.isArray(sizeLabels) || !sizeLabels.length) {
      return label;
    }

    const sizePattern = sizeLabels.map(escapeRegExp).join("|");
    const trailingSizeLabel = new RegExp(`\\s+(?:${sizePattern})$`, "i");

    return label.replace(trailingSizeLabel, "").trim();
  }

  // Create toolbar for categories with ARIA attributes
  const toolbar = document.createElement("nav");
  toolbar.id = "category-toolbar";
  toolbar.className = "category-toolbar";
  toolbar.setAttribute("role", "tablist");
  toolbar.setAttribute("aria-label", "Menu categories");
  container.appendChild(toolbar);

  // Create a container for subCategories and items
  const sectionContainer = document.createElement("section");
  sectionContainer.id = "menu-sections";
  sectionContainer.setAttribute("role", "tabpanel");
  sectionContainer.setAttribute("aria-live", "polite");
  container.appendChild(sectionContainer);

  // Create toolbar buttons for each category
  categoriesArray.forEach((category, index) => {
    if (category.hide || !category.subCategories?.length) return;

    const btn = document.createElement("button");
    btn.textContent = category.label;
    btn.dataset.categoryId = category._id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.setAttribute("aria-controls", "menu-sections");
    btn.setAttribute("tabindex", index === 0 ? "0" : "-1");

    btn.addEventListener("click", () => {
      renderCategorySections(category, btn);
    });

    // Keyboard navigation
    btn.addEventListener("keydown", (e) => {
      const buttons = Array.from(toolbar.querySelectorAll("button"));
      const currentIndex = buttons.indexOf(btn);
      let nextIndex;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = currentIndex + 1 >= buttons.length ? 0 : currentIndex + 1;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex =
          currentIndex - 1 < 0 ? buttons.length - 1 : currentIndex - 1;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = buttons.length - 1;
      }

      if (nextIndex !== undefined) {
        buttons[currentIndex].setAttribute("tabindex", "-1");
        buttons[nextIndex].setAttribute("tabindex", "0");
        buttons[nextIndex].focus();
      }
    });

    toolbar.appendChild(btn);
  });

  // Auto-render the first visible category
  const firstVisible = categoriesArray.find(
    (c) => !c.hide && c.subCategories?.length,
  );
  if (firstVisible) {
    const firstBtn = toolbar.querySelector(
      `button[data-category-id="${firstVisible._id}"]`,
    );
    renderCategorySections(firstVisible, firstBtn, true);
  }

  function renderCategorySections(category, clickedButton, doNotScroll) {
    sectionContainer.innerHTML = ""; // Clear previous content

    if (!doNotScroll) {
      setTimeout(() => {
        const toolbarHeight =
          document.getElementById("category-toolbar")?.offsetHeight || 0;

        const y = sectionContainer.offsetTop - toolbarHeight;

        window.scrollTo({ top: y, behavior: "smooth" });
      }, 50);
    }

    // Set active class and ARIA attributes on toolbar buttons
    const buttons = toolbar.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
      btn.setAttribute("tabindex", "-1");
    });

    if (clickedButton) {
      clickedButton.classList.add("active");
      clickedButton.setAttribute("aria-selected", "true");
      clickedButton.setAttribute("tabindex", "0");

      clickedButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    category.subCategories.forEach((sub, subIndex) => {
      if (sub.hide || !sub.items?.length) return;

      const usesSizes = sub.useSizes === true && Array.isArray(sub.sizes);
      const shouldUseArabic = sub.isArabic === true;

      const subDiv = document.createElement("article");
      subDiv.className = "subcategory";
      subDiv.style.animationDelay = `${subIndex * 60}ms`;

      if (shouldUseArabic) {
        subDiv.setAttribute("dir", "rtl");
        subDiv.setAttribute("lang", "ar");
        subDiv.classList.add("subcategory-arabic");
      }

      const subHeader = document.createElement("header");
      subHeader.className = "subcategory-header";

      const heading = document.createElement("h2");
      heading.id = `subcategory-${sub._id}`;
      heading.textContent = sub.label;
      subHeader.appendChild(heading);

      if (sub.bgImg) {
        subHeader.appendChild(
          createPreviewTrigger(
            sub.bgImg,
            `${sub.label} image`,
            "subcategory-image-button",
          ),
        );
      }
      subDiv.appendChild(subHeader);

      const itemsWrapper = document.createElement("div");
      itemsWrapper.className = "items-wrapper";
      itemsWrapper.setAttribute("role", "list");
      itemsWrapper.setAttribute("aria-labelledby", `subcategory-${sub._id}`);

      if (usesSizes && sub.sizes.length) {
        itemsWrapper.classList.add("items-wrapper-sizes");

        const sizeHeader = document.createElement("div");
        sizeHeader.className = "item-size-columns";
        sizeHeader.setAttribute("aria-hidden", "true");
        sizeHeader.style.setProperty("--size-count", String(sub.sizes.length));

        const spacer = document.createElement("span");
        spacer.className = "item-size-columns-spacer";
        sizeHeader.appendChild(spacer);

        sub.sizes.forEach((sizeLabel) => {
          const sizeHeading = document.createElement("span");
          sizeHeading.className = "item-size-column-label";
          sizeHeading.textContent = sizeLabel;
          sizeHeader.appendChild(sizeHeading);
        });

        itemsWrapper.appendChild(sizeHeader);
      }

      sub.items.forEach((item) => {
        if (item.hide) return;

        const itemSizes =
          item.sizes &&
          typeof item.sizes === "object" &&
          !Array.isArray(item.sizes)
            ? item.sizes
            : null;
        const orderedSizeLabels = usesSizes ? sub.sizes : [];
        const hasSizeRows = usesSizes && orderedSizeLabels.length > 0;

        const itemRow = document.createElement("div");
        itemRow.className = "item-row";
        itemRow.setAttribute("role", "listitem");
        if (hasSizeRows) {
          itemRow.classList.add("item-row-sizes");
          itemRow.style.setProperty(
            "--size-count",
            String(orderedSizeLabels.length),
          );
        }

        const itemMain = document.createElement("div");
        itemMain.className = "item-main";

        const itemContent = document.createElement("div");
        itemContent.className = "item-content";

        if (item.bgImg) {
          itemMain.appendChild(
            createPreviewTrigger(
              item.bgImg,
              `${item.label} image`,
              "item-image-button",
            ),
          );
        }

        const header = document.createElement("div");
        header.className = "item-header";
        if (hasSizeRows) {
          header.classList.add("has-sizes");
        }

        const name = document.createElement("span");
        name.className = "item-name";
        const newLabel = shouldUseArabic ? "جديد" : "New";
        const bestSellerLabel = shouldUseArabic
          ? "الأكثر مبيعًا"
          : "Best Seller";
        const lightLabel = shouldUseArabic ? "خفيف" : "Light";

        name.innerHTML =
          getDisplayItemLabel(item.label, orderedSizeLabels, hasSizeRows) +
          (item.is_New
            ? ` <span class="item-new" aria-label="${newLabel}">${newLabel}</span>`
            : item.is_Starred
              ? ` <span class="item-new" aria-label="${bestSellerLabel}">${bestSellerLabel}</span>`
              : item.is_Light
                ? ` <span class="item-new" aria-label="${lightLabel}">${lightLabel}</span>`
                : "") +
          (item.unit ? ` <span class="item-unit">${item.unit}</span>` : "");

        header.appendChild(name);

        if (!hasSizeRows) {
          const price = document.createElement("span");
          price.className = "item-price";
          price.setAttribute(
            "aria-label",
            `Price: ${formatItemPrice(item.price, shouldUseArabic)}`,
          );
          price.textContent = formatItemPrice(item.price, shouldUseArabic);
          header.appendChild(price);
        }

        itemContent.appendChild(header);

        if (item.description) {
          const desc = document.createElement("p");
          desc.className = "item-description";
          desc.textContent = item.description;
          itemContent.appendChild(desc);
        }

        itemMain.appendChild(itemContent);
        itemRow.appendChild(itemMain);

        if (hasSizeRows) {
          const sizeList = document.createElement("div");
          sizeList.className = "item-sizes";
          sizeList.setAttribute("role", "presentation");

          orderedSizeLabels.forEach((sizeLabel) => {
            const sizePrice = itemSizes?.[sizeLabel];
            const hasSizePrice = hasPriceValue(sizePrice);

            const sizeValue = document.createElement("span");
            sizeValue.className = "item-size-price";
            sizeValue.textContent = hasSizePrice
              ? formatItemPrice(sizePrice, shouldUseArabic)
              : "-";
            sizeValue.setAttribute("data-size-label", sizeLabel);

            if (hasSizePrice) {
              sizeValue.setAttribute(
                "aria-label",
                `${sizeLabel}: ${formatItemPrice(sizePrice, shouldUseArabic)}`,
              );
            } else {
              sizeValue.classList.add("item-size-price-empty");
              sizeValue.setAttribute(
                "aria-label",
                `${sizeLabel}: Not available`,
              );
            }

            sizeList.appendChild(sizeValue);
          });

          itemRow.appendChild(sizeList);
        }

        itemsWrapper.appendChild(itemRow);
      });

      subDiv.appendChild(itemsWrapper);

      if (sub.note) {
        const noteDiv = document.createElement("aside");
        noteDiv.className = "subcategory-note";
        noteDiv.setAttribute("aria-label", "Note");
        if (shouldUseArabic) {
          noteDiv.setAttribute("dir", "rtl");
          noteDiv.setAttribute("lang", "ar");
        }
        noteDiv.innerText = sub.note;
        subDiv.appendChild(noteDiv);
      }

      sectionContainer.appendChild(subDiv);
    });
  }

  // Swipe handling
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  sectionContainer.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  });

  sectionContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    endY = e.changedTouches[0].screenY;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 50;
    const verticalThreshold = 30;

    const deltaX = Math.abs(startX - endX);
    const deltaY = Math.abs(startY - endY);

    if (deltaX < threshold || deltaY > verticalThreshold) return;

    const currentIndex = categoriesArray.findIndex(
      (c) =>
        c._id === toolbar.querySelector("button.active")?.dataset.categoryId,
    );

    let nextIndex = null;

    if (startX > endX) {
      // Swiped left → next
      nextIndex = categoriesArray.findIndex((c, i) => i > currentIndex);
    } else {
      // Swiped right → previous
      const reversed = [...categoriesArray].reverse();
      const prevCandidates = reversed.filter(
        (c) => categoriesArray.indexOf(c) < currentIndex,
      );
      if (prevCandidates.length) {
        nextIndex = categoriesArray.indexOf(prevCandidates[0]);
      }
    }

    if (nextIndex !== null && nextIndex >= 0 && categoriesArray[nextIndex]) {
      const nextCat = categoriesArray[nextIndex];
      const nextBtn = toolbar.querySelector(
        `button[data-category-id="${nextCat._id}"]`,
      );
      renderCategorySections(nextCat, nextBtn);
    }
  }
}
