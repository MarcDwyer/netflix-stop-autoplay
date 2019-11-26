// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo["url"]) {
//     const { url } = changeInfo;
//     console.log(1);
//     if (url === "https://www.netflix.com/browse") {
//       console.log(2);
//       setTimeout(() => {
//         console.log(document);
//         const videos = document.querySelectorAll("video");
//         console.log(videos);
//         if (videos.length) {
//           console.log(3);
//           for (let x = 0; x < videos.length; x++) {
//             const vidDiv = videos[x];
//             vidDiv.src = "";
//           }
//         }
//       }, 5500);
//     }
//   }
// });
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

setTimeout(disableVideos, 2500);
