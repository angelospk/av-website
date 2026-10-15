(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (i) => String(i + 1).padStart(2, "0");

  // Services
  $("#serviceList").innerHTML = SERVICES.map((s, i) => `
    <li class="svc reveal" tabindex="0">
      <h3><span class="num">${pad(i)}</span>${esc(s.title)}</h3>
      <div><p>${esc(s.text)}<span class="who">${esc(s.who)}</span></p></div>
    </li>`).join("");

  // Filters
  const cats = ["Όλα", ...CATEGORIES];
  $("#filters").innerHTML = cats.map((c, i) =>
    `<button class="chip" type="button" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

  // Projects
  const statusClass = (s) => (s === "Σε εξέλιξη" ? "status live" : "status");
  $("#projectGrid").innerHTML = PROJECTS.map((p) => `
    <button class="card reveal${p.wide ? " wide" : ""}" data-id="${esc(p.id)}" data-cats="${esc(p.categories.join("|"))}">
      <div class="img">
        <img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">
        <span class="${statusClass(p.status)}">${esc(p.status)}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <p class="label meta">${esc(p.place)} · ${esc(p.year)} · ${esc(p.categories.join(" / "))}</p>
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
  const openProject = (id) => {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    const facts = Object.entries(p.facts || {}).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    const tl = (p.timeline || []).map((t) => `<li class="${t.done ? "done" : ""}"><span class="label">${esc(t.date)}</span>${esc(t.label)}</li>`).join("");
    const gal = (p.gallery || []).map((g) => `<img src="${esc(g)}" alt="" loading="lazy">`).join("");
    $("#dlgBody").innerHTML = `
      <div class="dlg-hero"><img src="${esc(p.cover)}" alt="${esc(p.title)}"></div>
      <div class="dlg-body">
        <div>
          <p class="label">${esc(p.place)} · ${esc(p.year)} · ${esc(p.status)}</p>
          <h2 id="dlgTitle">${esc(p.title)}</h2>
          <p>${esc(p.summary)}</p>
          <p>${esc(p.body)}</p>
          ${tl ? `<ul class="timeline">${tl}</ul>` : ""}
        </div>
        <div>
          <dl class="facts">${facts}</dl>
          <div class="tags">${p.categories.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
        </div>
      </div>
      ${gal ? `<div class="gallery">${gal}</div>` : ""}`;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    history.replaceState(null, "", `#project-${id}`);
  };
  $("#projectGrid").addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (c) openProject(c.dataset.id);
  });
  let closingFromHash = false;
  dlg.addEventListener("close", () => {
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

  // Process + team
  $("#steps").innerHTML = STEPS.map((s, i) => `
    <li class="reveal" style="transition-delay:${i * 80}ms">
      <span class="label">${pad(i)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
      <span class="label dur">${esc(s.dur)}</span>
    </li>`).join("");
  $("#teamGrid").innerHTML = TEAM.map((t, i) => `
    <div class="role reveal" style="transition-delay:${i * 60}ms">
      <b>${esc(t.n)}</b><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>
    </div>`).join("");

  // Nav background on scroll
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal + count-up
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countUp = (el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = end.toLocaleString("el-GR") + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e).toLocaleString("el-GR") + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  // Show final numbers if the stats are skipped via a nav jump; count-up replays on view.
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = (+el.dataset.count).toLocaleString("el-GR") + (el.dataset.suffix || "");
  });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
