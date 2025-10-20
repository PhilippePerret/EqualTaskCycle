
export function DGet(selector, container) {
  if (undefined === container) { container = document.body; }
  return container.querySelector(selector);
}