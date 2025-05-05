const categoriesArray = MENU_DATA.categories
  .filter((c) => !c.hide)
  .map((category) => {
    const subcategories = MENU_DATA.sub_categories
      .filter((sub) => !sub.hide && sub.categoryId === category._id)
      .map((sub) => {
        const items = MENU_DATA.items
          .filter((item) => !item.hide && item.subcategoryId === sub._id)
          .sort((a, b) => a.order - b.order);

        return {
          ...sub,
          items,
        };
      })
      .filter((sub) => sub.items.length > 0)
      .sort((a, b) => a.order - b.order);

    return {
      ...category,
      subcategories,
    };
  })
  .filter((c) => c.subcategories.length > 0)
  .sort((a, b) => a.order - b.order);

function addMenuInfo() {
  const startYear = 2022;
  const currentYear = new Date().getFullYear();
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.innerHTML = `&copy; ${startYear} - ${currentYear} &nbsp;|&nbsp; Powered by`;
  }

  document.title = MENU_DATA.store.storeName;

  if (MENU_DATA.store.storeLogo) {
    const link = document.getElementById("favicon");
    if (link) link.href = MENU_DATA.store.storeLogo;
  }

  const templateConfig = MENU_DATA?.templateConfig || {};

  Object.entries(templateConfig).forEach(([key, value]) => {
    value && document.documentElement.style.setProperty(key, value.trim());
  });

  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  const { store } = MENU_DATA;
  const header = document.createElement("div");
  header.className = "store-header";

  if (store.storeLogo) {
    header.innerHTML += `<img src="${store.storeLogo}" alt="Store Logo" loading="lazy">`;
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
    if (store.displayedPhoneNumber && store.phoneNumber) {
      socialDiv.innerHTML += `
        <a href="tel:${store.phoneNumber}" title="Call">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/></svg>
          ${store.displayedPhoneNumber}
        </a>
      `;
    }

    if (social.instagramUrl) {
      socialDiv.innerHTML += `
        <a href="${social.instagramUrl}" target="_blank" title="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/></svg>
        </a>
      `;
    }

    if (social.facebookUrl) {
      socialDiv.innerHTML += `
        <a href="${social.facebookUrl}" target="_blank" title="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>
        </a>
      `;
    }

    if (social.whatsappUrl) {
      socialDiv.innerHTML += `
        <a href="${social.whatsappUrl}" target="_blank" title="WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
        </a>
      `;
    }

    if (social.locationUrl) {
      socialDiv.innerHTML += `
        <a href="${social.locationUrl}" target="_blank" title="Location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>
        </a>
      `;
    }
    container.appendChild(header);

    header.appendChild(socialDiv);
  }
}

function createMenu(categoriesArray) {
  addMenuInfo();

  const currency = MENU_DATA?.store?.currency || "$";
  const container = document.getElementById("menu-container");

  // Create toolbar for categories
  const toolbar = document.createElement("div");
  toolbar.id = "category-toolbar";
  toolbar.className = "category-toolbar";
  container.appendChild(toolbar);

  // Create a container for subcategories and items
  const sectionContainer = document.createElement("div");
  sectionContainer.id = "menu-sections";
  container.appendChild(sectionContainer);

  // Create toolbar buttons for each category
  categoriesArray.forEach((category) => {
    if (category.hide || !category.subcategories?.length) return;

    const btn = document.createElement("button");
    btn.textContent = category.label;
    btn.dataset.categoryId = category._id;

    btn.addEventListener("click", () => {
      renderCategorySections(category, btn);
    });

    toolbar.appendChild(btn);
  });

  // Auto-render the first visible category
  const firstVisible = categoriesArray.find(
    (c) => !c.hide && c.subcategories?.length
  );
  if (firstVisible) {
    const firstBtn = toolbar.querySelector(
      `button[data-category-id="${firstVisible._id}"]`
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

    // Set active class on toolbar buttons
    const buttons = toolbar.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    if (clickedButton) {
      clickedButton.classList.add("active");

      clickedButton.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }

    category.subcategories.forEach((sub) => {
      if (sub.hide || !sub.items?.length) return;

      const subDiv = document.createElement("div");
      subDiv.className = "subcategory";

      const subHeader = document.createElement("div");
      subHeader.className = "subcategory-header";
      subHeader.innerHTML += `<h2>${sub.label}</h2>`;
      if (sub.bgImg) {
        subHeader.innerHTML += `<img src="${sub.bgImg}" alt="${sub.label}" loading="lazy">`;
      }
      subDiv.appendChild(subHeader);

      const itemsWrapper = document.createElement("div");
      itemsWrapper.className = "items-wrapper minimal-list";

      sub.items.forEach((item) => {
        if (item.hide) return;

        const itemRow = document.createElement("div");
        itemRow.className = "item-row";

        const header = document.createElement("div");
        header.className = "item-header";

        const name = document.createElement("span");
        name.className = "item-name";
        name.innerHTML =
          item.label +
          (item.is_New
            ? ' <span class="item-new">New</span>'
            : item.is_Starred
            ? ' <span class="item-new">Best Seller</span>'
            : "") +
          (item.unit ? ` <span class="item-unit">${item.unit}</span>` : "");

        const price = document.createElement("span");
        price.className = "item-price";
        price.textContent =
          item.price != null ? `${currency} ${item.price}` : "";

        header.appendChild(name);
        header.appendChild(price);
        itemRow.appendChild(header);

        if (item.description) {
          const desc = document.createElement("div");
          desc.className = "item-description";
          desc.textContent = item.description;
          itemRow.appendChild(desc);
        }

        itemsWrapper.appendChild(itemRow);
      });

      subDiv.appendChild(itemsWrapper);

      if (sub.note) {
        const noteDiv = document.createElement("div");
        noteDiv.className = "subcategory-note";
        noteDiv.innerText = sub.note;
        subDiv.appendChild(noteDiv);
      }

      sectionContainer.appendChild(subDiv);
    });
  }

  // Swipe handling
  let startX = 0;
  let endX = 0;

  sectionContainer.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  sectionContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 80;
    if (Math.abs(startX - endX) < threshold) return;

    const currentIndex = categoriesArray.findIndex(
      (c) =>
        c._id === toolbar.querySelector("button.active")?.dataset.categoryId
    );

    let nextIndex = null;

    if (startX > endX) {
      // Swiped left → next
      nextIndex = categoriesArray.findIndex((c, i) => i > currentIndex);
    } else {
      // Swiped right → previous
      const reversed = [...categoriesArray].reverse();
      const prevCandidates = reversed.filter(
        (c) => categoriesArray.indexOf(c) < currentIndex
      );
      if (prevCandidates.length) {
        nextIndex = categoriesArray.indexOf(prevCandidates[0]);
      }
    }

    if (nextIndex !== null && nextIndex >= 0 && categoriesArray[nextIndex]) {
      const nextCat = categoriesArray[nextIndex];
      const nextBtn = toolbar.querySelector(
        `button[data-category-id="${nextCat._id}"]`
      );
      renderCategorySections(nextCat, nextBtn);
    }
  }
}

createMenu(categoriesArray);

async function callLogApi() {
  try {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
      queryParams[key] = value;
    }

    const payload = {
      uuid: localStorage.getItem("uuid"),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      deviceOrientation: screen.orientation?.type || "unknown",
      service: MENU_DATA.store.menuId,

      platform: navigator.platform || "unknown",
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      queryParams,
      locationHref: location.href,
    };

    const response = await fetch(
      "https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const uuid = await response.text();
    localStorage.setItem("uuid", uuid);
  } catch {}
}

callLogApi();
