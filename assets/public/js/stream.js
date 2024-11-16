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
    let responce = userStreams.value.value.reverse();
    function refreshList(responce) {
      while (streamsElm.firstChild) {
        streamsElm.firstChild.remove();
      }
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
    }
    refreshList(responce);
    // (await db.getPublicMedia(username, ["streams"])).value.value.reverse()
    const output = document.getElementById("output");
    let active = responce[responce.length - 1].active === true;
    let last;
    const video = output.parentNode;
    let patched = false;
    function patch() {
      if (!patched) {
        // Monkey-patch error function
        const oldError = output.api.config.errorController.prototype.onError;
        output.api.config.errorController.prototype.onError = function (
          type,
          reason
        ) {
          if (type === "hlsError" && reason.type === "networkError") {
            setTimeout(() => {
              console.log("Reloading video");
              output.load();
            }, 2000);
          }
          return oldError.call(this, type, reason);
        };
        patched = true;
      }
    }
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
          responce = (
            await db.getPublicMedia(username, ["streams"])
          ).value.value.reverse();
          // Show stream
          const manifestUrl = `${apiV1RestBase}/stream/${username}/${
            id || responce.length
          }/masterPl.m3u8`;
          output.src = manifestUrl;
          patch();
          if (Array.from(holder.children).includes(screenSaver)) {
            holder.replaceChild(video, screenSaver);
            refreshList(responce);
          }
        } else {
          output.src = "";
          holder.replaceChild(screenSaver, video);
          responce = (
            await db.getPublicMedia(username, ["streams"])
          ).value.value.reverse();
          refreshList(responce);
        }
      }
      last = active;
    }
    if (id) {
      // Show stream
      const manifestUrl = `${apiV1RestBase}/stream/${username}/${
        id || responce.length
      }/masterPl.m3u8`;
      output.src = manifestUrl;
      patch();
      setInterval(() => refreshList(responce), 30000);
    } else {
      setInterval(() => init().catch(console.log.bind(console)), 5000);
      await init().catch(console.log.bind(console));
    }
  } else {
    document.write("Invalid user");
  }
})();
