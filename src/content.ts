const debounce = (
  func: Function,
  dur: number,
): EventListenerOrEventListenerObject => {
  let timer: number | undefined;
  return function () {
    const ctx = this,
      args = arguments;

    clearTimeout(timer);

    //@ts-ignore
    timer = setTimeout(() => {
      func.apply(ctx, args);
    }, dur);
  };
};

function stopAutoplay() {
  if (document.location.href.includes("watch")) {
    return;
  }
  const vl = document.querySelectorAll("video");
  for (const v of vl) {
    v.src = "";
  }
}

window.addEventListener("load", stopAutoplay);
document.addEventListener("DOMNodeInserted", debounce(stopAutoplay, 250));
