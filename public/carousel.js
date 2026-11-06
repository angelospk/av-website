// Photo carousel for a project: CSS scroll-snap slides (native swipe) + arrows + thumbnails.
// An optional first slide holds the 3D model (loaded only when the carousel mounts).
// Markup: carouselHTML() below. Usage: const destroy = mountCarousel(root).
(() => {
  const here = document.currentScript.src;
  const motion = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // pics: [cover, ...gallery]; model: URL or empty.
  window.carouselHTML = (pics, model, title) => {
    const slides = (model ? [`<div class="slide slide-3d"><canvas aria-label="3D μοντέλο: ${esc(title)}"></canvas><span class="label slide-hint">3D · σύρετε για περιστροφή</span></div>`] : [])
      .concat(pics.map((g, i) => `<img class="slide" src="${esc(g)}" alt="${i ? "" : esc(title)}" ${i ? 'loading="lazy"' : ""}>`));
    const thumbs = (model ? [`<button type="button" class="thumb-3d" aria-label="3D μοντέλο"><span>3D</span></button>`] : [])
      .concat(pics.map((g, i) => `<button type="button" aria-label="Φωτογραφία ${i + 1}"><img src="${esc(g)}" alt="" loading="lazy"></button>`));
    const many = slides.length > 1;
    return `<div class="dlg-hero media" data-model="${esc(model || "")}">
      <div class="slides" tabindex="0" aria-label="Φωτογραφίες">${slides.join("")}</div>
      ${many ? `<button type="button" class="arrow prev" aria-label="Προηγούμενη">‹</button><button type="button" class="arrow next" aria-label="Επόμενη">›</button>` : ""}
    </div>${many ? `<div class="gallery">${thumbs.join("")}</div>` : ""}`;
  };

  // root: element that contains the .media and the .gallery.
  window.mountCarousel = (root) => {
    const media = root.querySelector(".media");
    if (!media) return () => {};
    const track = media.querySelector(".slides");
    const thumbs = [...root.querySelectorAll(".gallery button")];
    const prev = media.querySelector(".prev"), next = media.querySelector(".next");
    const n = track.children.length;
    const index = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (i) => track.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * track.clientWidth, behavior: motion() });
    const sync = () => {
      const i = index();
      thumbs.forEach((b, j) => b.setAttribute("aria-pressed", j === i));
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === n - 1;
    };
    let raf = 0;
    track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); });
    prev?.addEventListener("click", () => go(index() - 1));
    next?.addEventListener("click", () => go(index() + 1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(index() + 1); }
    });
    thumbs.forEach((b, j) => b.addEventListener("click", () => {
      go(j);
      media.scrollIntoView({ behavior: motion(), block: "nearest" });
    }));
    sync();

    let dispose = () => {}, gone = false;
    const canvas = media.querySelector(".slide-3d canvas");
    if (canvas && media.dataset.model) {
      import(new URL("model3d.js", here).href).then(({ mountModel }) => {
        if (!gone) dispose = mountModel(canvas, media.dataset.model);
      });
    }
    return () => { gone = true; dispose(); };
  };
})();
