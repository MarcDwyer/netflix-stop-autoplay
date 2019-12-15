const debounce = (
  func: Function,
  dur: number
): EventListenerOrEventListenerObject => {
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
const findElements = (queries: string[]): Element[] => {
  const not = ":not([stopped=true])";
  const result = [];
  for (const query of queries) {
    result.push([...document.querySelectorAll(query + not)]);
  }
  //@ts-ignore
  return result.flat(Infinity);
};
const addTransitionEvt = (element: Element) => {
  element.setAttribute("stopped", "true");
  element.addEventListener("transitionstart", () => {
    const vid = element.querySelector("video");
    if (vid) {
      vid.src = "";
    }
  });
};
const billBoardQueries = ["div.billboard", "div.billboard-row"];

const queries = [
  "div.slider-item",
  // "span.handle",
  "div[class*='video']",
  "div.background"
];
const attachListeners = (elements: Element[]) => {
  for (const ele of elements) {
    addTransitionEvt(ele);
  }
};
const listenNewMedia = (e?: MutationEvent) => {
  if (
    e &&
    e.srcElement &&
    //@ts-ignore
    /image-rotator-image/g.test(e.srcElement.classList.value)
  )
    return;
  const queryResults = findElements([...queries, ...billBoardQueries]);
  attachListeners(queryResults);
};
document.addEventListener("DOMNodeInserted", debounce(listenNewMedia, 650));
