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
  const { oldPassword, newPassword } = new Proxy(new FormData(form), {
    get(t, p) {
      return t.get(p);
    },
    set() {
      return false;
    },
  });
  const responce = await db.changePassword(localStorage.username, oldPassword, newPassword);
  if (responce.type === 0) {
    window.location.href = "/account.html";
  } else {
    error.innerText = responce.reasons.join(", ");
    error.style.display = "block";
  }
};
