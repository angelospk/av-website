// Home hero: the Τσουκαλάδες model builds itself, then turns slowly. Drag to orbit.
import { mountModel } from "./model3d.js";

mountModel(document.getElementById("hero3d"), new URL("models/tsoukalades-villa.glb", import.meta.url).href, { hero: true });
if (matchMedia("(any-pointer: coarse)").matches) {
  const tag = document.getElementById("modelTag");
  if (tag) tag.textContent = "3D · Κατοικία στους Τσουκαλάδες";
}
