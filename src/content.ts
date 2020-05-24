const debounce = (
  func: Function,
  dur: number
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

// These queries are elements that have auto-playing videos as children
const queries = {
  billBoardQueries: ["div.billboard", "div.billboard-row"],
  regQueries: ["div.slider-item", "div[class*='video']", "div.background"],
  profileScreen: "div.list-profiles",
  profileCards: "div.profile-icon",
};

const getElements = (queries: string | string[]): Element[] => {
  if (typeof queries === "string") {
    queries = [queries];
  }
  // An additional query that prevents us from selecting already tagged elements
  const not = ":not([stopped=true])";
  const results = [];
  for (const query of queries) {
    results.push(...document.querySelectorAll(query + not));
  }
  return results;
};
// Tag elements with an attribute and eventListener
const tagElement = (
  eles: Element[],
  eventType: string,
  func: (ele: Element) => void
) => {
  for (const ele of eles) {
    ele.addEventListener(eventType, () => func(ele));
    ele.setAttribute("stopped", "true");
  }
};

const scan = () => {
  const { regQueries, billBoardQueries, profileScreen } = queries;
  const checkPofile = getElements(profileScreen);
  if (checkPofile && checkPofile.length) {
    tagElement(checkPofile, "click", () => setTimeout(scan, 450));
  }

  const tagThese = getElements([...regQueries, ...billBoardQueries]);
  tagElement(tagThese, "transitionstart", (ele: Element) => {
    const vid = ele.querySelector("video");
    if (vid) {
      vid.src = "";
    }
  });
};

window.addEventListener("load", scan);
document.addEventListener("DOMNodeInserted", debounce(scan, 450));
