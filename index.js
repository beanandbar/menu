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
  const now = new Date().getTime();
  const lastCall = localStorage.getItem("lastCall");
  if (lastCall) {
    const lastCallNb = Number(lastCall);
    if (now - lastCallNb < 1800000) {
      return;
    }
  }

  try {
    await fetch(
      "https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendLogData()),
      }
    );

    localStorage.setItem("lastCall", now.toString());
  } catch (error) {}
}

function sendLogData() {
  let uuid = localStorage.getItem("uuid");

  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem("uuid", uuid);
  }

  return {
    uuid,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    deviceOrientation: screen.orientation.type,
    service: MENU_DATA.store.menuId,
  };
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

callLogApi();
