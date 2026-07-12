(function () {
  "use strict";

  // Flatten config sections into a single ordered list of items
  const ITEMS = BOOK_CONFIG.sections.flatMap((s) => s.items);

  const app = document.getElementById("app");
  const track = document.getElementById("track");
  const pageTitle = document.getElementById("pageTitle");
  const dotsEl = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const drawer = document.getElementById("drawer");
  const drawerList = document.getElementById("drawerList");
  const drawerTitle = document.getElementById("drawer-title");
  const scrim = document.getElementById("scrim");
  const menuBtn = document.getElementById("menuBtn");
  const drawerClose = document.getElementById("drawerClose");
  const reader = document.getElementById("reader");
  const topbar = document.querySelector(".topbar");
  const footbar = document.querySelector(".footbar");
  const chromeToggle = document.getElementById("chromeToggle");

  document.title = BOOK_CONFIG.appTitle || document.title;
  drawerTitle.textContent = "Daftar Isi";

  let current = 0;

  // Accepts either a bare Drive file ID or a full Drive URL and returns
  // just the ID, so config.js works no matter which one gets pasted in.
  function extractFileId(raw) {
    if (!raw) return "";
    const value = raw.trim();
    const match = value.match(/\/d\/([a-zA-Z0-9_-]+)/) || value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : value;
  }

  function isConfigured(item) {
    const id = extractFileId(item.fileId);
    return !!id && id !== "GANTI_DENGAN_FILE_ID";
  }

  function drivePreviewUrl(rawId) {
    return `https://drive.google.com/file/d/${extractFileId(rawId)}/preview`;
  }

  // ---------- Build panels ----------
  function buildPanel(item) {
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.dataset.id = item.id;

    if (isConfigured(item)) {
      const frameWrap = document.createElement("div");
      frameWrap.className = "panel-frame-wrap";
      const iframe = document.createElement("iframe");
      iframe.loading = "lazy";
      iframe.src = drivePreviewUrl(item.fileId);
      iframe.title = item.label;
      iframe.allow = "autoplay";
      frameWrap.appendChild(iframe);
      panel.appendChild(frameWrap);
    } else {
      const empty = document.createElement("div");
      empty.className = "panel-empty";
      empty.innerHTML = `
        <svg class="ornament" viewBox="0 0 100 100" aria-hidden="true"><use href="#rub-el-hizb"></use></svg>
        <h3>${item.label}</h3>
        <p>Link PDF belum ditempel. Buka <code>config.js</code>, cari
        <code>id: "${item.id}"</code>, lalu ganti <code>fileId</code> dengan
        ID file Google Drive-nya.</p>
      `;
      panel.appendChild(empty);
    }
    return panel;
  }

  ITEMS.forEach((item) => track.appendChild(buildPanel(item)));

  // ---------- Build drawer list ----------
  let flatIndex = 0;
  BOOK_CONFIG.sections.forEach((section) => {
    const label = document.createElement("div");
    label.className = "drawer-group-label";
    label.textContent = section.group;
    drawerList.appendChild(label);

    section.items.forEach((item) => {
      const idx = flatIndex++;
      const btn = document.createElement("button");
      btn.className = "drawer-item";
      btn.dataset.index = String(idx);
      btn.innerHTML = `<span class="ribbon"></span><span>${item.label}</span>`;
      btn.addEventListener("click", () => {
        goTo(idx);
        closeDrawer();
      });
      drawerList.appendChild(btn);
    });
  });

  // ---------- Build dots ----------
  ITEMS.forEach((item, idx) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.dataset.index = String(idx);
    dotsEl.appendChild(dot);
  });

  // ---------- Navigation ----------
  function render() {
    const offset = -current * 100;
    track.style.transform = `translateX(${offset}%)`;

    const item = ITEMS[current];
    pageTitle.textContent = item.label;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === ITEMS.length - 1;

    [...dotsEl.children].forEach((d, i) => d.classList.toggle("active", i === current));
    [...drawerList.querySelectorAll(".drawer-item")].forEach((b) =>
      b.classList.toggle("active", Number(b.dataset.index) === current)
    );

    const activeDot = dotsEl.children[current];
    if (activeDot) activeDot.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(ITEMS.length - 1, index));
    render();
    showChrome();
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  document.addEventListener("keydown", (e) => {
    if (drawer.classList.contains("open")) return;
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // ---------- Swipe (touch) ----------
  let startX = 0, startY = 0, dragging = false, deltaX = 0, lockedAxis = null;

  track.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    dragging = true; deltaX = 0; lockedAxis = null;
    track.style.transition = "none";
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (lockedAxis === null) {
      lockedAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (lockedAxis !== "x") return;

    deltaX = dx;
    const base = -current * track.clientWidth;
    track.style.transform = `translateX(${base + dx}px)`;
  }, { passive: true });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    const threshold = track.clientWidth * 0.18;
    if (lockedAxis === "x") {
      if (deltaX < -threshold) { goTo(current + 1); }
      else if (deltaX > threshold) { goTo(current - 1); }
      else { render(); }
    }
    deltaX = 0; lockedAxis = null;
  }
  track.addEventListener("touchend", endDrag);
  track.addEventListener("touchcancel", endDrag);

  window.addEventListener("resize", render);

  // ---------- Drawer open/close ----------
  function openDrawer() {
    drawer.classList.add("open");
    scrim.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    showChrome();
    clearTimeout(hideTimer);
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    resetHideTimer();
  }
  menuBtn.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);

  // ---------- Auto-hide chrome (immersive reading mode) ----------
  // Topbar & footbar hide themselves after a few seconds of inactivity so
  // the PDF reads full-screen. Tapping the reader background, changing
  // pages, or using the always-reachable floating pill brings them back.
  const HIDE_DELAY = 3000;
  let chromeHidden = false;
  let hideTimer = null;

  function showChrome() {
    chromeHidden = false;
    topbar.classList.remove("hidden");
    footbar.classList.remove("hidden");
    chromeToggle.classList.remove("show");
    resetHideTimer();
  }

  function hideChrome() {
    if (drawer.classList.contains("open")) return;
    chromeHidden = true;
    topbar.classList.add("hidden");
    footbar.classList.add("hidden");
    chromeToggle.classList.add("show");
  }

  function resetHideTimer() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideChrome, HIDE_DELAY);
  }

  function toggleChrome() {
    if (chromeHidden) showChrome();
    else hideChrome();
  }

  // Tapping empty reader background (not the PDF iframe itself, which is
  // cross-origin and swallows its own taps) also toggles the chrome.
  reader.addEventListener("click", (e) => {
    if (e.target === reader || e.target.closest(".panel-empty")) toggleChrome();
  });
  chromeToggle.addEventListener("click", toggleChrome);

  // ---------- Init ----------
  render();
  resetHideTimer();

  // ---------- Service worker (offline shell) ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }
})();
