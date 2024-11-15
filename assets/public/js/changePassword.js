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
  const { username, oldPassword, newPassword } = new Proxy(new FormData(form), {
    get(t, p) {
      return t.get(p);
    },
    set() {
      return false;
    },
  });
  const responce = await db.changePassword(username, oldPassword, newPassword);
  if (responce.type === 0) {
    localStorage.token = responce.value.token;
    localStorage.username = username;
    localStorage.loggedIn = true;
    window.location.href = "/account.html";
  } else {
    error.innerText = responce.reasons.join(", ");
    error.style.display = "block";
  }
};
