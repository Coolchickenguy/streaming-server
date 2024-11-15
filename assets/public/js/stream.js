(async () => {
  const [username, id] = window.location.pathname.split("/").slice(2);
  const userStreams = await db.getPublicMedia(username, ["streams"]);
  const streamsElm = document.getElementById("streams");
  if (userStreams.type === 0) {
    // Show profile info
    const image = document.getElementById("profileImage");
    const usernameP = document.getElementById("username");
    image.src =
      apiV1RestBase +
      `/account/getProfileImage?user=${encodeURIComponent(username)}`;
    usernameP.textContent = username;
    // Show stream list
    const responce = userStreams.value.value.reverse();
    for (const streamIndex in responce) {
      const stream = responce[streamIndex];
      const streamA = document.createElement("a");
      streamA.className = "link";
      streamA.href = `/stream/${username}/${responce.length - streamIndex}`;
      streamA.textContent = `${new Date(stream.startDate)}${
        stream.active ? " (Active)" : ""
      }`;
      streamsElm.appendChild(streamA);
    }
    const output = document.getElementById("output");
    /* if (responce[0].active || id) {
      // Show stream
      const manifestUrl = `${apiV1RestBase}/stream/${username}/${
        id || "latest"
      }/masterPl.m3u8`;
      output.src = manifestUrl;
    } else {*/
    let active = responce[0].active;
    let last;
    const video = output.parentNode;
    const screenSaver = document.createElement("div");
    const holder = video.parentNode;
    screenSaver.textContent = "Not brodcasting";
    async function init() {
      active = await (
        await fetch(apiV1RestBase + "/brodcast/active", {
          method: "post",
          body: JSON.stringify({ username }),
          headers: { "Content-Type": "application/json" },
        })
      ).json();
      if (active !== last) {
        if (active) {
          // Show stream
          const manifestUrl = `${apiV1RestBase}/stream/${username}/${
            id || responce.length
          }/masterPl.m3u8`;
          output.src = manifestUrl;
          if (Array.from(holder.children).includes(screenSaver)) {
            console.log("replace");
            holder.replaceChild(screenSaver, video);
          }
        } else {
          holder.replaceChild(video, screenSaver);
        }
      }
      last = active;
    }
    setInterval(init, 5000);
    await init();
    //}
  } else {
    document.write("Invalid user");
  }
})();
