const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("click", function (ev) {
  ev.stopPropagation();
});
function search() {
  const { value } = searchInput;
  window.location.href = new URL(
    `/search.html?q=${encodeURIComponent(value)}`,
    window.location.href
  ).href;
}
searchInput.addEventListener("keypress", function (ev) {
  if (ev.key === "Enter") {
    search();
  }
});
searchBar.addEventListener("click", function (ev) {
  search();
});
