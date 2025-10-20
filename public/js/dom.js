
export function DGet(selector, container) {
  if (undefined === container) { container = document.body; }
  return container.querySelector(selector);
}

export function stopEvent(ev){
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}