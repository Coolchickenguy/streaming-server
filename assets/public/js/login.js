if ((localStorage.loggedIn === "true")) {
  window.location.href = "/account.html";
}
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("form");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("failReason");
form.onsubmit = async function submit(ev) {
  ev.preventDefault();
  const { username, password } = new Proxy(new FormData(form), {
    get(t, p) {
      return t.get(p);
    },
    set() {
      return false;
    },
  });
  const responce = await db.createToken(username, password);
  if (responce.type === 0) {
    localStorage.token = responce.value.token;
    localStorage.username = username;
    localStorage.loggedIn = true;
    window.location.href = "/";
  } else {
    error.innerText = responce.reasons.join(", ");
    error.style.display = "block";
  }
};
