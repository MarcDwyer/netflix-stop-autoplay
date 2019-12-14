const debounce = (
  func: Function,
  dur: number
): EventListenerOrEventListenerObject => {
  let timer;
  return function () {
    const ctx = this,
      args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(ctx, args);
    }, dur);
  };
};
const getNewDivs = (query: string, not?: boolean): Element[] => {
  query = not ? query + ":not([stopped=true])" : query;

  const queryResult = document.querySelectorAll(query);
  return [...queryResult];
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

const queries = ["div.slider-item", "span.handle", "div.billboard", "div.billboard-row", "div[class*='video']", "div.background"]

const listenNewMedia = (e?: MutationEvent) => {
  //@ts-ignore
  if (
    e &&
    e.srcElement &&
    //@ts-ignore
    /image-rotator-image/g.test(e.srcElement.classList.value)
  )
    return;
  const queryResults = queries
    .map(divStr => getNewDivs(divStr, true))
    //@ts-ignore
    .flat(Infinity);
  if (!queryResults.length) return
  for (const ele of queryResults) {
    addTransitionEvt(ele)
  }
};
listenNewMedia()
document.addEventListener(
  "DOMNodeInserted",
  debounce(listenNewMedia, 650)
);
