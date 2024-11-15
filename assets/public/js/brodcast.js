if (!(localStorage.loggedIn === "true")) {
  window.location.href = "/login.html";
}
(async () => {
  const premissionsResponce = await db.getPublicMedia(localStorage.username, [
    "premissions",
  ]);
  if (premissionsResponce.type === 0) {
    const premissions = premissionsResponce.value?.value ?? {};
    const canBrodcast = premissions?.abilities?.brodcast === true;
    if (canBrodcast) {
      // Init page
      const brodcastButton = document.getElementById("brodcastButton");
      brodcastButton.addEventListener("click", async function brodcast() {
        brodcastButton.disabled = true;
        const onChunk = db.publishStream(localStorage.token, "webm");
        await getUserMedia(onChunk);
        const linkHolder = document.createElement("p");
        linkHolder.className = "brodcastLink";
        const link = document.createElement("a");
        link.href = new URL(
          `/stream/${localStorage.username}`,
          window.location.href
        ).href;
        link.textContent = link.href;
        linkHolder.textContent = "Others may now view your brodcast at ";
        linkHolder.appendChild(link);
        document.body.appendChild(linkHolder);
      });
    } else {
      window.location.href = "/";
    }
  } else {
    console.log("Invalid session?");
  }
})().catch((e) => document.write(e.message));
