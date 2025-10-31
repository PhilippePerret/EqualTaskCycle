
export function DGet(selector, container) {
  if (undefined === container) { container = document.body; }
  try {
    return container.querySelector(selector);
  } catch(error) {
    if (!container) {
      throw new Error(`[DGet] Container undefined for selector ${selector}: ${error.message}`)
    } else {
      throw new Error(`[DGet] Unable to find selector ${selector} in container ${container.tagName}#${container.id}: ${error.message}`);
    }
  }
}

export function stopEvent(ev){
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}