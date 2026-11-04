/*
  Project sheet for the brown mockups: fills a <dialog id="dlg"> with photos,
  facts and timeline, and keeps the #erga/<id> deep link in sync.
  Needs window.PROJECTS. Each page styles the classes itself:
  .dlg-grid .dlg-media .stage .thumbs .dlg-info .sum .body .kv .tl .crumbs

  Usage: ProjectSheet.init({ trigger: "#proj", onOpen(dlg, project) {} })
  (buttons with data-id inside; the <img> inside the button is the morph source)

  Morph: when View Transitions exist and motion is allowed, the clicked photo
  morphs into the dialog's main photo and back on close. The shared element is
  named "proj-photo"; the dialog itself is "proj-sheet". Pages style the motion
  with ::view-transition-group(proj-photo) / ::view-transition-new(proj-sheet) etc.
  During the transition <html> has class "vt-open" or "vt-close".
  Without support (or with reduced motion) the dialog opens and closes plainly.
*/
window.ProjectSheet = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const canMorph = () => !!document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dlg, nativeClose, srcImg = null, onOpen = null;

  function render(p) {
    const pics = [p.cover, ...(p.gallery || [])];
    const facts = { "Τοποθεσία": p.place, "Έτος": p.year, "Κατάσταση": p.status, "Κατηγορία": (p.categories || []).join(", "), ...(p.facts || {}) };
    dlg.querySelector("#dlgBody").innerHTML = `
      <div class="dlg-media">
        <div class="stage"><img id="stageImg" src="${esc(pics[0])}" alt="${esc(p.title)}"></div>
        ${pics.length > 1 ? `<div class="thumbs">${pics.map((src, i) => `<button type="button" data-src="${esc(src)}" aria-pressed="${i === 0}" aria-label="Φωτογραφία ${i + 1} από ${pics.length}"><img src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="dlg-info">
        <h2 id="dlgTitle">${esc(p.title)}</h2>
        <p class="sum">${esc(p.summary || "")}</p>
        ${p.body ? `<p class="body">${esc(p.body)}</p>` : ""}
        <dl class="kv">${Object.entries(facts).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
        ${p.timeline ? `<p class="tl-h">Χρονολόγιο</p><ol class="tl">${p.timeline.map(t => `<li class="${t.done ? "done" : ""}"><time>${esc(t.date)}</time><i></i><span>${esc(t.label)}</span></li>`).join("")}</ol>` : ""}
      </div>`;
    dlg.querySelector("#crumbs").innerHTML = `<a href="#top" data-close>Αρχική</a><span aria-hidden="true">/</span><a href="#erga" data-close>Έργα</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span>`;
  }

  function show(p) {
    dlg.showModal(); dlg.scrollTop = 0;
    if (onOpen) onOpen(dlg, p);
  }

  function open(id, fromEl) {
    const p = (window.PROJECTS || []).find(x => x.id === id); if (!p) return;
    if (location.hash !== "#erga/" + p.id) history.pushState(null, "", "#erga/" + p.id);
    srcImg = fromEl ? fromEl.querySelector("img") : null;
    if (!canMorph() || !srcImg) { render(p); show(p); return; }
    srcImg.style.viewTransitionName = "proj-photo";
    document.documentElement.classList.add("vt-open");
    const vt = document.startViewTransition(() => {
      srcImg.style.viewTransitionName = "";
      render(p);
      dlg.querySelector("#stageImg").style.viewTransitionName = "proj-photo";
      dlg.style.viewTransitionName = "proj-sheet";
      show(p);
    });
    vt.finished.finally(() => {
      document.documentElement.classList.remove("vt-open");
      const st = dlg.querySelector("#stageImg"); if (st) st.style.viewTransitionName = "";
      dlg.style.viewTransitionName = "";
    });
  }

  function close() {
    if (!dlg.open) return;
    const st = dlg.querySelector("#stageImg");
    const back = srcImg && srcImg.isConnected ? srcImg : null;
    if (!canMorph() || !back || !st) { nativeClose(); return; }
    st.style.viewTransitionName = "proj-photo";
    dlg.style.viewTransitionName = "proj-sheet";
    document.documentElement.classList.add("vt-close");
    const vt = document.startViewTransition(() => {
      st.style.viewTransitionName = ""; dlg.style.viewTransitionName = "";
      nativeClose();
      back.style.viewTransitionName = "proj-photo";
    });
    vt.finished.finally(() => { document.documentElement.classList.remove("vt-close"); back.style.viewTransitionName = ""; });
  }

  function init(opts) {
    dlg = document.getElementById("dlg");
    onOpen = opts.onOpen || null;
    nativeClose = HTMLDialogElement.prototype.close.bind(dlg);
    dlg.close = close; // close buttons call dlg.close(): route them through the morph
    dlg.addEventListener("cancel", e => { e.preventDefault(); close(); }); // Esc
    document.querySelector(opts.trigger).addEventListener("click", e => { const b = e.target.closest("[data-id]"); if (b) open(b.dataset.id, b); });
    dlg.addEventListener("click", e => {
      const t = e.target.closest(".thumbs button");
      if (t) {
        const img = dlg.querySelector("#stageImg"); img.src = t.dataset.src;
        img.style.animation = "none"; img.offsetWidth; img.style.animation = "";
        dlg.querySelectorAll(".thumbs button").forEach(b => b.setAttribute("aria-pressed", b === t)); return;
      }
      const a = e.target.closest("[data-close]");
      if (a) { e.preventDefault(); nativeClose(); document.querySelector(a.getAttribute("href") === "#top" ? "body" : "#erga").scrollIntoView(); return; }
      if (e.target === dlg) close();
    });
    dlg.addEventListener("close", () => { if (location.hash.startsWith("#erga/")) history.pushState(null, "", "#erga"); });
    const fromHash = () => {
      const m = location.hash.match(/^#erga\/(.+)$/);
      if (m && !dlg.open) { const id = decodeURIComponent(m[1]); open(id, document.querySelector(`${opts.trigger} [data-id="${CSS.escape(id)}"]`)); }
      else if (!m && dlg.open) nativeClose();
    };
    addEventListener("popstate", fromHash); fromHash();
  }

  return { init, open, close, esc };
})();
