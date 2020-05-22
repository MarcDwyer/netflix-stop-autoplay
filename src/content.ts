const debounce = (
  func: Function,
  dur: number,
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

class StopNetflix {
  // These queries are elements that have auto-playing videos as children
  private queries = {
    billBoardQueries: ["div.billboard", "div.billboard-row"],
    regQueries: ["div.slider-item", "div[class*='video']", "div.background"],
    profileScreen: "div.list-profiles",
    profileCards: "div.profile-icon",
  };
  private getElements(queries: string | string[]): Element[] {
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
  }
  // Tag elements with an attribute and eventListener
  private tagElement(
    eles: Element[],
    eventType: string,
    func: (ele: Element) => void,
  ) {
    for (const ele of eles) {
      ele.addEventListener(eventType, () => func(ele));
      ele.setAttribute("stopped", "true");
    }
  }
  // Sometimes when logging into Netflix you must choose which profile to select
  // Need a special function to handle such a case.
  private handleInit() {
    const { profileScreen } = this.queries;
    const checkPofile = this.getElements(profileScreen);
    if (checkPofile && checkPofile.length) {
      this.tagElement(
        checkPofile,
        "click",
        () => setTimeout(() => this.scan(), 450),
      );
    }
  }
  scan(init?: boolean) {
    if (init) {
      this.handleInit();
      return;
    }
    const { regQueries, billBoardQueries } = this.queries;

    const tagThese = this.getElements([...regQueries, ...billBoardQueries]);
    this.tagElement(tagThese, "transitionstart", (ele: Element) => {
      const vid = ele.querySelector("video");
      if (vid) {
        vid.src = "";
      }
    });
  }
}

const stopNetflix = new StopNetflix();

stopNetflix.scan(true);
document.addEventListener(
  "DOMNodeInserted",
  debounce(() => stopNetflix.scan(), 450),
);
