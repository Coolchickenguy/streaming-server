async function checkSession() {
  const out = await db.validateToken(localStorage.token);
  const { tokenVailidity } = out.value;
  if (tokenVailidity !== 0) {
    await db.logout();
    window.location.href = "/login.html";
  }
}
setInterval(checkSession, 30 * 1000);
checkSession();
