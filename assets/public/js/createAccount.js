if (localStorage.loggedIn === "true") {
  window.location.href = "/account.html";
}
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("form");
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
  const createAccountResponce = await db.createAccount(username, password);
  if (createAccountResponce.type === 0) {
    const token = await db.createToken(username, password);
    if (createAccountResponce.type === 0) {
      localStorage.token = token.value.token;
      localStorage.username = username;
      localStorage.loggedIn = true;
      window.location.href = "/";
    } else {
      error.textContent = `Unknown error.`;
      error.style.display = "block";
    }
  } else {
    error.textContent = createAccountResponce.reasons;
    error.style.display = "block";
  }
};
