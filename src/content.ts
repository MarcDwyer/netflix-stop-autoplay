const NODEINSERTED = Symbol("newnode"),
  ONCLICK = Symbol("click");

type EventPayload = {
  list: Element[] | NodeListOf<Element>;
  type: Symbol;
};
type IMyEvents = {
  addTransitionEvt(ele: Element): void;
  addClickEvt(ele: Element): void;
};
type MyQueries = {
  getDivs?: string;
  getSpans?: string;
  getBillboard?: string;
  subBillboard?: string;
  getVideos?: string;
};
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
  if (!queryResult.length) {
    return [];
  }
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
class NetflixListener {
  public queries: MyQueries;
  constructor() {
    this.queries = {
      getDivs: "div.slider-item",
      getSpans: "span.handle",
      getBillboard: "div.billboard",
      subBillboard: "div.billboard-row",
      getVideos: "div[class*='video']"
    };
  }

  attachListeners = (payload: Element[]) => {
    if (!payload.length) return;
    for (const ele of payload) {
      addTransitionEvt(ele);
    }
  };
  listenNewMedia = (e?: MutationEvent) => {
    //@ts-ignore
    if (
      e &&
      e.srcElement &&
      //@ts-ignore
      /image-rotator-image/g.test(e.srcElement.classList.value)
    )
      return;
    const playableDivs = Object.values(this.queries);
    const queryResults = playableDivs
      .map(divStr => getNewDivs(divStr, true))
      //@ts-ignore
      .flat(Infinity);
    if (!playableDivs) return;
    this.attachListeners(queryResults);
  };
}
const controlFlix = new NetflixListener();
controlFlix.listenNewMedia();

document.addEventListener(
  "DOMNodeInserted",
  debounce(controlFlix.listenNewMedia, 650)
);
