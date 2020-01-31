const queries = {
  billBoardQueries: ["div.billboard", "div.billboard-row"],
  regQueries: [
    "div.slider-item",
    // "span.handle",
    "div[class*='video']",
    "div.background"
  ],
  profileScreen: "div.list-profiles",
  profileCards: "div.profile-icon"
};

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
type SetQueries = {
  (): Element[];
};
const getQueryList = (queries: string[]): Element[] => {
  const not = ":not([stopped=true])";
  const results: Element[] = [];
  for (const query of queries) {
    results.push(...document.querySelectorAll(query + not));
  }
  console.log(results);
  return results;
};
const addTransitionEvts = (nodes: Element[]) => {
  for (const node of nodes) {
    node.setAttribute("stopped", "true");
    node.addEventListener("transitionstart", () => {
      const vid = node.querySelector("video");
      if (vid) {
        vid.src = "";
      }
    });
  }
};
const nukeBillboard = (profileEle: Element) => {
  const profileCards = profileEle.querySelectorAll(queries.profileCards);
  for (const card of profileCards) {
    card.addEventListener("click", () => setTimeout(listenNewMedia, 450));
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
  const { regQueries, billBoardQueries, profileScreen } = queries;
  const checkProfile = document.querySelector(profileScreen);
  if (checkProfile) {
    nukeBillboard(checkProfile);
    return;
  }
  const elements = getQueryList([...regQueries, ...billBoardQueries]);
  addTransitionEvts(elements);
};
listenNewMedia();
document.addEventListener("DOMNodeInserted", debounce(listenNewMedia, 450));
