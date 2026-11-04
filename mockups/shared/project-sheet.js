/*
  Project sheet for the brown mockups: fills a <dialog id="dlg"> with photos,
  facts and timeline, and keeps the #erga/<id> deep link in sync.
  Needs window.PROJECTS. Each page styles the classes itself:
  .dlg-grid .dlg-media .stage .thumbs .dlg-info .sum .body .kv .tl .crumbs
  Usage: ProjectSheet.init({ trigger: "#proj" })  (buttons with data-id inside)
*/
window.ProjectSheet = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let dlg;

  function open(id) {
    const p = (window.PROJECTS || []).find(x => x.id === id); if (!p) return;
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
    if (location.hash !== "#erga/" + p.id) history.pushState(null, "", "#erga/" + p.id);
    dlg.showModal(); dlg.scrollTop = 0;
  }

  function init({ trigger }) {
    dlg = document.getElementById("dlg");
    document.querySelector(trigger).addEventListener("click", e => { const b = e.target.closest("[data-id]"); if (b) open(b.dataset.id); });
    dlg.addEventListener("click", e => {
      const t = e.target.closest(".thumbs button");
      if (t) {
        const img = dlg.querySelector("#stageImg"); img.src = t.dataset.src;
        img.style.animation = "none"; img.offsetWidth; img.style.animation = "";
        dlg.querySelectorAll(".thumbs button").forEach(b => b.setAttribute("aria-pressed", b === t)); return;
      }
      const a = e.target.closest("[data-close]");
      if (a) { e.preventDefault(); dlg.close(); document.querySelector(a.getAttribute("href") === "#top" ? "body" : "#erga").scrollIntoView(); return; }
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", () => { if (location.hash.startsWith("#erga/")) history.pushState(null, "", "#erga"); });
    const fromHash = () => { const m = location.hash.match(/^#erga\/(.+)$/); if (m && !dlg.open) open(decodeURIComponent(m[1])); else if (!m && dlg.open) dlg.close(); };
    addEventListener("popstate", fromHash); fromHash();
  }

  return { init, open, esc };
})();
