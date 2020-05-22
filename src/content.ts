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

class StopNetflix {
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
    const not = ":not([stopped=true])";
    const results = [];
    for (const query of queries) {
      results.push(...document.querySelectorAll(query + not));
    }
    return results;
  }
  private tagElement(eles: Element[], eventType: string, func: Function) {
    for (const ele of eles) {
      ele.addEventListener(eventType, () => func(ele));
      ele.setAttribute("stopped", "true");
    }
  }
  scan(init?: boolean) {
    const { regQueries, billBoardQueries } = this.queries;
    if (init) {
      const { profileScreen } = this.queries;
      const checkPofile = this.getElements(profileScreen);
      if (checkPofile && checkPofile.length) {
        this.tagElement(checkPofile, "click", () =>
          setTimeout(() => this.scan(), 450)
        );
        return;
      }
    }
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
  debounce(() => stopNetflix.scan(), 450)
);
