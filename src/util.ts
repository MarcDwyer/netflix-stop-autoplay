export const debounce = (
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
