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
  const { password, newPassword } = new Proxy(new FormData(form), {
    get(t, p) {
      return t.get(p);
    },
    set() {
      return false;
    },
  });
  const responce = await db.deleteAccount(localStorage.username, password, newPassword);
  if (responce.type === 0) {
    await db.logout();
    window.location.href = "/";
  } else {
    error.innerText = responce.reasons.join(", ");
    error.style.display = "block";
  }
};
