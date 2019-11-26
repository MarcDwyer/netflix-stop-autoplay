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
  let playableDivs = document.querySelectorAll("div.slider-item");
  console.log(playableDivs.length);
  if (playableDivs.length) {
    for (let x = 0; x < playableDivs.length; x++) {
      const pDiv = playableDivs[x];
      pDiv.addEventListener("transitionend", e => {
        const vid = pDiv.querySelector("video");
        if (vid) {
          vid.src = "";
        }
      });
    }
  }
}

setTimeout(disableVideos, 1500);
listener();
