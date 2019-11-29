const TRANSITIONSTART = "transitionstart",
  ONCLICK = "click";

type EventPayload = {
  list: Element[] | NodeListOf<Element>;
  type: string;
};
type IMyEvents = {
  addTransitionEvt(ele: Element): void;
  addClickEvt(ele: Element): void;
};
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
const getNewDivs = (query: string[], not?: boolean): Element[] | null => {
  const notStr = not ? ":not([stopped=true])" : "";
  let finalQuery = query
    .map(q => {
      return q + notStr;
    })
    .join(",");
  // console.log(finalQuery);
  const queryResult = document.querySelectorAll(finalQuery);
  if (!queryResult.length) {
    return null;
  }
  return [...queryResult];
};
const addTransitionEvt = (element: Element) => {
  element.addEventListener(TRANSITIONSTART, e => {
    const vid = element.querySelector("video");
    if (vid) {
      element.setAttribute("stopped", "true");
      vid.src = "";
    }
  });
};
class NetflixListener {
  queries = {
    getDivs: "div.slider-item",
    getSpans: "span.handle",
    getBillboard: "div.billboard",
    getVideos: "div[class*='video']"
  };
  attachListeners = (payload: EventPayload[]) => {
    if (!payload.length) return;
    for (let x = 0; x < payload.length; x++) {
      const { list } = payload[x];
      if (!list.length) return;
      for (let j = 0; j < list.length; j++) {
        const element = list[j];
        // console.log(element.hasAttribute("stopped"));
        addTransitionEvt(element);
      }
    }
  };
  listenNewMedia = (e?: MutationEvent) => {
    const { getDivs, getBillboard, getVideos } = this.queries;
    //@ts-ignore
    if (
      e &&
      e.srcElement &&
      //@ts-ignore
      /image-rotator-image/g.test(e.srcElement.classList.value)
    )
      return;
    const playableDivs = getNewDivs([getDivs, getBillboard, getVideos], true);
    if (!playableDivs) return;
    const payload: EventPayload[] = [
      {
        list: [...playableDivs],
        type: TRANSITIONSTART
      }
    ];
    this.attachListeners(payload);
  };
}
const controlFlix = new NetflixListener();
controlFlix.listenNewMedia();

window.addEventListener(
  "DOMNodeInserted",
  debounce(controlFlix.listenNewMedia, 650)
);
