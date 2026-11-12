(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (i) => String(i + 1).padStart(2, "0");

  // Services
  $("#serviceList").innerHTML = SERVICES.map((s, i) => `
    <li class="svc reveal" tabindex="0">
      <h3><span class="num">${pad(i)}</span>${esc(s.title)}</h3>
      <div><p>${esc(s.text)}</p></div>
    </li>`).join("");

  // Filters
  const cats = ["Όλα", ...CATEGORIES];
  $("#filters").innerHTML = cats.map((c, i) =>
    `<button class="chip" type="button" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

  // Projects
  const statusClass = (s) => (s === "Σε εξέλιξη" ? "status live" : "status");
  // Μόνο τα στοιχεία που υπάρχουν: κενό έτος ή κατάσταση δεν φαίνεται.
  const meta = (...xs) => xs.filter(Boolean).map(esc).join(" · ");
  $("#projectGrid").innerHTML = PROJECTS.map((p) => `
    <button class="card reveal${p.wide ? " wide" : ""}" data-id="${esc(p.id)}" data-cats="${esc(p.categories.join("|"))}">
      <div class="img">
        <img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">
        ${p.status ? `<span class="${statusClass(p.status)}">${esc(p.status)}</span>` : ""}
      </div>
      <h3>${esc(p.title)}</h3>
      <p class="label meta">${meta(p.place, p.year, p.categories.join(" / "))}</p>
    </button>`).join("");

  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    const cat = b.dataset.cat;
    document.querySelectorAll(".card").forEach((card) => {
      const show = cat === "Όλα" || card.dataset.cats.split("|").includes(cat);
      card.classList.toggle("hide", !show);
      if (show) card.classList.add("in");
    });
  });

  // Project dialog (deep link: #project-<id>)
  const dlg = $("#projectDialog");
  let destroyCarousel = () => {};
  const openProject = (id) => {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    const facts = Object.entries(p.facts || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    const tl = (p.timeline || []).map((t) => `<li class="${t.done ? "done" : ""}"><span class="label">${esc(t.date)}</span>${esc(t.label)}</li>`).join("");
    destroyCarousel(); // free the old 3D viewer before its canvas leaves the DOM
    $("#dlgBody").innerHTML = `
      ${carouselHTML([p.cover, ...(p.gallery || [])], p.model, p.title)}
      <div class="dlg-body">
        <div>
          <p class="label">${meta(p.place, p.year, p.status)}</p>
          <h2 id="dlgTitle">${esc(p.title)}</h2>
          <p>${esc(p.summary)}</p>
          <div class="md">${p.html || ""}</div>
          ${tl ? `<ul class="timeline">${tl}</ul>` : ""}
        </div>
        <div>
          <dl class="facts">${facts}</dl>
          <div class="tags">${p.categories.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
          <p><a class="btn btn-ghost btn-sm" href="${window.BASE || ""}/erga/${encodeURIComponent(p.id)}/">Σελίδα έργου</a></p>
        </div>
      </div>`;
    if (!dlg.open) dlg.showModal();
    destroyCarousel = mountCarousel($("#dlgBody"));
    dlg.scrollTop = 0;
    history.replaceState(null, "", `#project-${id}`);
  };
  $("#projectGrid").addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (c) openProject(c.dataset.id);
  });
  let closingFromHash = false;
  dlg.addEventListener("close", () => {
    destroyCarousel();
    destroyCarousel = () => {};
    if (!closingFromHash && location.hash.startsWith("#project-")) history.replaceState(null, "", location.pathname + "#projects");
    closingFromHash = false;
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  const fromHash = () => {
    const m = location.hash.match(/^#project-(.+)$/);
    let id = null;
    if (m) { try { id = decodeURIComponent(m[1]); } catch { /* malformed hash */ } }
    if (id && PROJECTS.some((p) => p.id === id)) openProject(id);
    else if (dlg.open) { closingFromHash = true; dlg.close(); }
  };
  addEventListener("hashchange", fromHash);
  fromHash();

  // Process
  const steps = $("#steps"); // missing when the section is hidden from the CMS
  if (steps) steps.innerHTML = STEPS.map((s, i) => `
    <li class="reveal" style="transition-delay:${i * 80}ms">
      <span class="label">${pad(i)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
      <span class="label dur">${esc(s.dur)}</span>
    </li>`).join("");

  // Nav background on scroll
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const setMenu = (open) => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Reveal
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
