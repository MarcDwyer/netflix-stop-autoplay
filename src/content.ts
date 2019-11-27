const notStr = ":not([isStopped=true])";

function attachListener(ele: Array<Element>) {
  if (NodeList.prototype.isPrototypeOf(ele)) {
    ele = [...ele];
  }
  for (let x = 0; x < ele.length; x++) {
    const pDiv = ele[x];
    pDiv.addEventListener("transitionstart", () => {
      const vid = pDiv.querySelector("video");
      pDiv.setAttribute("isStopped", "true");
      if (vid) {
        vid.src = "";
      }
    });
  }
}

function initListener() {
  const billboard = document.querySelector(`.billboard`);

  if (!billboard) return;
  attachListener([
    billboard,
    ...document.querySelectorAll("div[class*='video']")
  ]);
}
function listenNewDivs() {
  const playableDivs = document.querySelectorAll(`div.slider-item${notStr}`);
  attachListener([...playableDivs]);
}
const debounce = (func, dur) => {
  let timer;
  return function() {
    const ctx = this,
      args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(ctx, args);
    }, dur);
  };
};
initListener();
listenNewDivs();

document.addEventListener("scroll", debounce(listenNewDivs, 650));
