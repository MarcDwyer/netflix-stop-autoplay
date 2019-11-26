function disableVideos() {
  const videos = document.querySelectorAll("video");

  if (videos.length) {
    for (let x = 0; x < videos.length; x++) {
      console.log(videos);
      const vidDiv = videos[x];
      vidDiv.src = "";
    }
  }
}

function listener() {
  const playableDivs = document.querySelectorAll("div.slider-item");
  console.log(playableDivs.length);
  if (playableDivs.length) {
    for (let x = 0; x < playableDivs.length; x++) {
      const pDiv = playableDivs[x];
      if (pDiv.isStopped) continue
      pDiv.addEventListener("transitionend", e => {
        const vid = pDiv.querySelector("video");
        if (vid) {
          pDiv.isStopped = true
          vid.src = "";
        }
      });
    }
  }
}
const debounce = (func, dur) => {
  let timer;
  return function () {
    const ctx = this,
      args = arguments

    clearTimeout(timer)
    time = setTimeout(() => {
      func.apply(ctx, args)
    }, dur)
  }
}
setTimeout(disableVideos, 1500);
listener();

document.addEventListener("scroll", debounce(listener, 650))