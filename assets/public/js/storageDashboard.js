if (!(localStorage.loggedIn === "true")) {
  window.location.href = "/login.html";
}
(async () => {
  let storage;
  async function refreshStorage() {
    const storageResponce = await db.getStorageSize(localStorage.token);
    if (storageResponce.type === 0) {
      const { storageUse, maxStorage } = storageResponce.value;
      storage = { storageUse, maxStorage };
    } else if (storageResponce.type === 4) {
      window.location.href = "/account.html";
    } else {
      await checkSession();
    }
  }
  function all(object, callback, keys = [], parentType = "") {
    if (typeof object === "object") {
      const objectKeys = Object.keys(object);
      for (const key of objectKeys) {
        all(
          object[key],
          callback,
          [...keys, key],
          Array.isArray(object) ? "array" : "object"
        );
      }
    } else {
      callback(object, keys, parentType);
    }
  }
  const magnitudes = [
    "byte",
    "kilobyte",
    "megabytes",
    "gigabytes",
    "terabytes",
    "petabyes",
    "exabyte",
    "zettabyte",
    "yottabyte",
  ];
  function bestStorage(bytes) {
    let i = 0;
    while (bytes >= 999 && ((bytes /= 1000) || true)) {
      i++;
    }
    return `${Math.round(bytes)} ${
      bytes > 1.4
        ? magnitudes[i]
        : magnitudes[i].slice(0, magnitudes[i].length - 1)
    }`;
  }
  // https://stackoverflow.com/a/7616484
  function hash(str) {
    let hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  function mapColor(value) {
    const h = hash(value);
    return "#" + (h & 0xffffff).toString(16).padStart(6, "0");
  }
  function get(value, path) {
    let ref = value;
    for (const segment of path) {
      ref = ref[segment];
    }
    return ref;
  }
  function getData(...path) {
    const ref = get(storage.storageUse, path);
    const output = {};
    for (const key in ref) {
      const value = ref[key];
      if (typeof value === "number") {
        output[key] = value;
      } else {
        let total = 0;
        all(value, (value) => (total += value));
        output[key] = total;
      }
    }
    const entries = Object.entries(output);
    return {
      labels: entries.map(([key]) => key),
      datasets: [
        {
          label: "Server storage",
          data: entries.map(([_key, value]) => value),
          backgroundColor: entries.map(([key, value]) => mapColor(key + value)),
          hoverOffset: 4,
        },
      ],
    };
  }
  let path = [];
  const chart = new Chart("chart", {
    type: "doughnut",
    options: {
      onClick: function (_event, elements) {
        if (elements.length > 0) {
          const dataClickedIndex = elements[0]._index;
          const dataClickedLabel = this.data.labels[dataClickedIndex];
          const isDir =
            typeof get(storage.storageUse, [...path, dataClickedLabel]) ===
            "object";
          if (isDir) {
            path.push(dataClickedLabel);
            this.data = getData(...path);
            update();
          }
        }
      },
    },
  });
  const use = document.getElementById("use");
  async function updatePage() {
    await refreshStorage();
    let total = 0;
    all(storage.storageUse, (value) => (total += value));
    use.textContent = `${bestStorage(total)}/${bestStorage(
      storage.maxStorage
    )}`;
    if (total > storage.maxStorage) {
      use.style.color = "red";
    } else {
      use.style.color = "black";
    }
    while (Object.keys(get(storage.storageUse, path) ?? {}).length === 0) {
      path.pop();
    }
    chart.data = getData(...path);
    update();
  }
  const back = document.getElementById("back");
  const deleteElm = document.getElementById("delete");
  function update(...args) {
    if (path.length === 0) {
      back.style.visibility = "hidden";
      deleteElm.style.visibility = "hidden";
    } else {
      back.style.visibility = "visible";
      if (path[0] === "streams" && path[1] && path[2]) {
        deleteElm.style.visibility = "visible";
      } else {
        deleteElm.style.visibility = "hidden";
      }
    }
    return chart.update(...args);
  }
  back.addEventListener("click", () => {
    if (path.pop()) {
      chart.data = getData(...path);
      update();
    }
  });
  deleteElm.addEventListener("click", async () => {
    if (path[0] === "streams" && path[1] && path[2]) {
      const responce = await db.deleteExternalBrodcast(
        localStorage.token,
        path[1],
        Number(path[2])
      );
      if (responce.type === 0) {
        await updatePage();
      } else if (responce.type === 4) {
        window.location.href = "/account.html";
      } else {
        await checkSession();
      }
    }
  });
  document.getElementById("refresh").addEventListener("click", updatePage);
  await updatePage();
})();
