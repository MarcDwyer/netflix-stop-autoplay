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
function getNewDivs(query: string, not?: boolean): Element[] {
  const notStr = not ? ":not([isStopped=true])" : "";
  return [...document.querySelectorAll(`${query + notStr}`)];
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
      const { list, type } = payload[x];
      for (let j = 0; j < list.length; j++) {
        const element = list[j];
        switch (type) {
          case TRANSITIONSTART:
            this.myEvents.addTransitionEvt(element);
            break;
          case ONCLICK:
            this.myEvents.addClickEvt(element);
        }
      }
    }
  };
  initListener = () => {
    const { getBillboard, getVideos } = this.queries;
    const billboard = document.querySelector(getBillboard);

    const payload: EventPayload[] = [
      {
        list: [billboard, ...document.querySelectorAll(getVideos)],
        type: TRANSITIONSTART
      }
    ];
    this.attachListeners(payload);
  };
  listenNewDivs = () => {
    const { getDivs, getSpans } = this.queries;
    const playableDivs = getNewDivs(getDivs, true),
      spanDivs = getNewDivs(getSpans, true);
    const payload: EventPayload[] = [
      {
        list: [...playableDivs],
        type: TRANSITIONSTART
      },
      {
        list: [...spanDivs],
        type: ONCLICK
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
  addClickEvt(element: Element) {
    element.addEventListener(ONCLICK, () => {
      const { getDivs } = this.props.queries;

      setTimeout(() => {
        const newDivs = getNewDivs(getDivs, true),
          payload: EventPayload[] = [
            {
              list: newDivs,
              type: TRANSITIONSTART
            }
          ];
        this.props.attachListeners(payload);
      }, 1000);
    });
  }
}

const controlFlix = new NetflixListener();
controlFlix.initListener();
controlFlix.listenNewDivs();

document.addEventListener("scroll", debounce(controlFlix.listenNewDivs, 650));
