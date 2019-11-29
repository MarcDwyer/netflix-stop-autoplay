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
function getNewDivs(query: string, not?: boolean): Element[] | null {
  const notStr = not ? ":not([isStopped=true])" : "";
  const queryRes = document.querySelectorAll(`${query + notStr}`);
  if (!queryRes.length) {
    return null;
  }
  return [...queryRes];
}
class NetflixListener {
  public myEvents: MyEvents;
  constructor() {
    this.myEvents = new MyEvents(this);
  }
  queries = {
    getDivs: "div.slider-item",
    getSpans: "span.handle",
    getBillboard: ".billboard",
    getVideos: "div[class*='video']"
  };
  attachListeners = (payload: EventPayload[]) => {
    if (!payload.length) return;
    for (let x = 0; x < payload.length; x++) {
      const { list } = payload[x];
      if (!list.length) return;
      for (let j = 0; j < list.length; j++) {
        const element = list[j];
        this.myEvents.addTransitionEvt(element);
      }
    }
  };
  listenNewMedia = () => {
    const { getDivs, getBillboard, getVideos } = this.queries;
    const playableDivs = getNewDivs(
      `${getDivs},${getBillboard},${getVideos}`,
      true
    );
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
class MyEvents {
  public props: NetflixListener;
  constructor(props) {
    this.props = props;
  }
  addTransitionEvt(element: Element) {
    element.addEventListener(TRANSITIONSTART, e => {
      const vid = element.querySelector("video");
      if (vid) {
        element.setAttribute("isStopped", "true");
        vid.src = "";
      }
    });
  }
}

const controlFlix = new NetflixListener();
// controlFlix.initListener();
controlFlix.listenNewMedia();

window.addEventListener(
  "DOMNodeInserted",
  debounce(controlFlix.listenNewMedia, 650)
);
