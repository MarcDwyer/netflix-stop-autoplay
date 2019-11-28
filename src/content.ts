const TRANSITIONSTART = "transitionstart",
  ONCLICK = "click";

type EventPayload = {
  list: Element[] | NodeListOf<Element>;
  type: string;
};
const myEvents = {
  addTransitionEvt: function(element: Element) {
    element.addEventListener(TRANSITIONSTART, () => {
      const vid = element.querySelector("video");
      element.setAttribute("isStopped", "true");
      if (vid) {
        vid.src = "";
      }
    });
  },
  addClickEvt: function(element: Element) {
    element.addEventListener(ONCLICK, () => {
      console.log(this);
      this.addTransitionEvt();
    });
  }
};

const attachListeners = (payload: EventPayload[]) => {
  for (let x = 0; x < payload.length; x++) {
    const { list, type } = payload[x];
    for (let j = 0; j < list.length; j++) {
      const element = list[j];
      switch (type) {
        case TRANSITIONSTART:
          myEvents.addTransitionEvt(element);
          break;
        case ONCLICK:
          myEvents.addClickEvt(element);
      }
    }
  }
};

function initListener() {
  const billboard = document.querySelector(`.billboard`);

  if (!billboard) return;
  const payload: EventPayload[] = [
    {
      list: [billboard, ...document.querySelectorAll("div[class*='video']")],
      type: TRANSITIONSTART
    }
  ];
  attachListeners(payload);
}
function listenNewDivs() {
  const playableDivs = getNewDivs("div.slider-item", true),
    spanDivs = getNewDivs("span.handle");
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
  attachListeners(payload);
}
function getNewDivs(query: string, not?: boolean) {
  const notStr = not ? ":not([isStopped=true])" : "";
  return document.querySelectorAll(`${query + notStr}`);
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
