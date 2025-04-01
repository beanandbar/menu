const CATEGORIES_DOM = document.getElementById("categories");

document.title = MENU_DATA.store.storeName;

if (MENU_DATA.store.storeLogo) {
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.href = MENU_DATA.store.storeLogo;
  link.type = "image/x-icon";
  document.head.appendChild(link);
}

MENU_DATA.sub_categories
  .sort((a, b) => a.order - b.order)
  .forEach((category) => {
    CATEGORIES_DOM.innerHTML += `<img src="${category.bgImg}" alt="${category.label}">`;
  });

async function callLogApi() {
  try {
    const payload = {
      uuid: localStorage.getItem("uuid"),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      deviceOrientation: screen.orientation?.type || "unknown",
      service: MENU_DATA.store.menuId,

      platform: navigator.platform || "unknown",
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
