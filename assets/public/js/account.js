if (!(localStorage.loggedIn === "true") && params.username === null) {
  window.location.href = "/login.html";
}
const { username } = params.username ? params : localStorage;
(async () => {
  const isUserValid = await db.validateUsername(username);
  const usernameP = document.getElementById("username");
  const icon = document.getElementById("icon");
  const logout = document.getElementById("lGroup");
  const role = document.getElementById("role");
  const actions = document.getElementById("actions");
  icon.src =
    apiV1RestBase +
    `/account/getProfileImage?user=${encodeURIComponent(username)}`;
  if (isUserValid) {
    usernameP.textContent = username;
    const premissionsResponce = await db.getPublicMedia(username, [
      "premissions",
    ]);
    let premissions = {};
    if (premissionsResponce.type === 0) {
      premissions = premissionsResponce.value?.value ?? {};
    }
    const abilities = Object.entries(premissions.abilities ?? {})
      .filter(([key, value]) => value)
      .map(([key]) => key);
    const userType = abilities.includes("admin")
      ? "admin"
      : abilities.includes("brodcast")
      ? "brodcast"
      : "user";
    role.textContent = userType;
    if (abilities.includes("brodcast")) {
      const a = document.createElement("a");
      a.className = "link";
      a.textContent = "See brodcasts";
      a.href = "/stream/" + username;
      actions.appendChild(a);
      actions.appendChild(document.createElement("br"));
      actions.appendChild(document.createElement("br"));
    }
    if (username !== localStorage.username) {
      // If it is not your account, you can't change the icon
      icon.style.opacity = "1";
    } else {
      logout.style.visibility = "visible";
      logout.addEventListener("click", async function () {
        await db.logout();
        window.location.href = "/";
      });
      icon.addEventListener("click", function () {
        const inputElm = document.createElement("input");
        inputElm.type = "file";
        // Images supported by canvases
        inputElm.accept =
          "image/bmp, image/gif, image/jpeg, image/svg+xml, image/tiff, image/png";
        inputElm.click();
        inputElm.addEventListener("change", async function onUpload(ev) {
          const file = this.files[0];
          const url = URL.createObjectURL(file);
          const res = await db.setProfileImage(localStorage.token, url);
          if (res.type !== 0) {
            alert(res.reasons.join(", "));
          }
          icon.src = icon.src + "&1=1";
        });
      });
      for (const ability of abilities) {
        if (ability === "brodcast") {
          const a = document.createElement("a");
          a.className = "link";
          a.textContent = "Brodcast";
          a.href = "/brodcast.html";
          actions.appendChild(a);
          actions.appendChild(document.createElement("br"));
          actions.appendChild(document.createElement("br"));
        } else if (ability === "admin") {
          const a = document.createElement("a");
          a.className = "link";
          a.textContent = "Go do admin stuff";
          a.href = "/adminDashboard.html";
          actions.appendChild(a);
          actions.appendChild(document.createElement("br"));
          actions.appendChild(document.createElement("br"));
        }
      }
    }
  } else {
    icon.style.opacity = "1";
  }
})();
