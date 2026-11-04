/*
  <av-logo> : the A/V mark with the original draw loop (12s: draw A, draw V,
  hold, erase both, redraw). One component for every page.

  Usage:  <script src="shared/av-logo.js"></script>
          <av-logo style="width:44px"></av-logo>
  Colours: --logo-a (default currentColor), --logo-v (default #8A9099).
  Attribute "once" draws one time and holds (no loop).
  Astro: same markup and CSS go into src/components/Logo.astro.
*/
(() => {
  if (customElements.get("av-logo")) return;
  const css = `
  av-logo { display: inline-block; line-height: 0; aspect-ratio: 915 / 685; }
  av-logo svg { width: 100%; height: 100%; overflow: visible; }
  av-logo polyline { fill: none; stroke-width: 34; stroke-linejoin: miter; stroke-miterlimit: 10; stroke-dasharray: 1; stroke-dashoffset: 1; }
  av-logo .la { stroke: var(--logo-a, currentColor); animation: av-draw-a 12s cubic-bezier(.6,0,.3,1) .2s infinite; }
  av-logo .lv { stroke: var(--logo-v, #8A9099); animation: av-draw-v 12s cubic-bezier(.6,0,.3,1) .2s infinite; }
  av-logo[once] .la { animation: av-once 1s cubic-bezier(.6,0,.3,1) .2s forwards; }
  av-logo[once] .lv { animation: av-once 1s cubic-bezier(.6,0,.3,1) .7s forwards; }
  @keyframes av-draw-a { 0% { stroke-dashoffset: 1; } 8% { stroke-dashoffset: 0; } 90% { stroke-dashoffset: 0; } 96%, 100% { stroke-dashoffset: -1; } }
  @keyframes av-draw-v { 0%, 4% { stroke-dashoffset: 1; } 13% { stroke-dashoffset: 0; } 91% { stroke-dashoffset: 0; } 98%, 100% { stroke-dashoffset: -1; } }
  @keyframes av-once { to { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: reduce) { av-logo polyline { animation: none !important; stroke-dashoffset: 0; } }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  customElements.define("av-logo", class extends HTMLElement {
    connectedCallback() {
      if (this.firstChild) return;
      this.setAttribute("aria-hidden", "true");
      this.innerHTML = '<svg viewBox="0 0 915 685"><polyline class="la" pathLength="1" points="30,395 320,30 570,415"/><polyline class="lv" pathLength="1" points="205,295 405,295 635,655 885,325"/></svg>';
    }
  });
})();
