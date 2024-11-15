// Api stuff
/**
 * Make an api request
 * @param {string} url
 * @param {any} body
 * @returns If it worded or not. 0=yes 1=api returned error
 */
async function makeApiPostRequest(url, body) {
  const responce = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const json = await responce.json();
  if (!responce.ok) {
    return { type: 1, reasons: json.reasons, value: json };
  }
  return { type: 0, value: json };
}
const apiV1RestBase = "/api/rest/v1";
const apiV1WebsocketBase = "/api/websocket/v1";

class apiV1 {
  createAccount(username, password) {
    return makeApiPostRequest(apiV1RestBase + "/createAccount", {
      username,
      password,
    });
  }
  deleteAccount(username, password) {
    return makeApiPostRequest(apiV1RestBase + "/deleteAccount", {
      username,
      password,
    });
  }
  changePassword(username, password, newPassword) {
    return makeApiPostRequest(apiV1RestBase + "/changePassword", {
      username,
      password,
      newPassword,
    });
  }
  createToken(username, password) {
    return makeApiPostRequest(apiV1RestBase + "/createToken", {
      username,
      password,
    });
  }
  deleteToken(token) {
    return makeApiPostRequest(apiV1RestBase + "/deleteToken", { token });
  }
  async logout(token = localStorage.token) {
    await this.deleteToken(token);
    localStorage.loggedIn = "false";
    delete localStorage.username;
    delete localStorage.token;
  }
  validateToken(token) {
    return makeApiPostRequest(apiV1RestBase + "/validateToken", { token });
  }
  getPublicMedia(username, path) {
    return makeApiPostRequest(apiV1RestBase + "/media/public/get", {
      username,
      path: path.join("."),
    });
  }
  getPrivateMedia(token, path) {
    return makeApiPostRequest(apiV1RestBase + "/media/private/get", {
      token,
      path,
    });
  }
  setPremissions(token, user, premissionsPath, value) {
    return makeApiPostRequest(apiV1RestBase + "/setPremissions", {
      token,
      user,
      premissionsPath,
      value,
    });
  }
  /**
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  async validateUsername(username) {
    const responce = await makeApiPostRequest(
      apiV1RestBase + "/validateUsername",
      {
        username,
      }
    );
    return responce.value.value;
  }
  /**
   * Set the profile image of the user
   * @param {string} token
   * @param {string} newImage
   */
  async setProfileImage(token, newImage) {
    return makeApiPostRequest(apiV1RestBase + "/account/setProfileImage", {
      token,
      image: await anyToPng(newImage, [200, 200]),
    });
  }
  publishStream(token, format) {
    const connection = new WebSocket(
      apiV1WebsocketBase + `/publishStream/${token}.${format}`
    );
    connection.onclose = ({ reason, code }) => {
      if (code !== 1000) {
        console.log(reason, code);
        throw { type: 1, reason: reason };
      }
    };
    return (chunk) => {
      connection.send(chunk);
    };
  }
  // Admins are the best!
  getServerInfo(token) {
    return makeApiPostRequest(apiV1RestBase + "/admin/severInfo", {
      token,
    });
  }
  deleteExternalAccount(token, username) {
    return makeApiPostRequest(apiV1RestBase + "/admin/deleteAccount", {
      token,
      username,
    });
  }
  setPremissions(token, user, premissionsPath, value) {
    return makeApiPostRequest(apiV1RestBase + "/admin/setPremissions", {
      token,
      user,
      premissionsPath,
      value: JSON.stringify(value),
    });
  }
  async deleteExternalProfileImage(token, user) {
    return makeApiPostRequest(apiV1RestBase + "/admin/deleteProfileImage", {
      token,
      user,
    });
  }
}
async function getUserMedia(onChunk) {
  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  const recorder = new MediaRecorder(media, { mimeType: "video/webm" });
  recorder.ondataavailable = function (ev) {
    onChunk(ev.data);
  };
  recorder.start(500);
}
async function getDisplayMedia(onChunk) {
  const media = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  });
  const recorder = new MediaRecorder(media, { mimeType: "video/webm" });
  recorder.ondataavailable = function (ev) {
    onChunk(ev.data);
  };
  recorder.start(500);
}
/**
 * Convert any image type supported by the browser to a png
 * @param {Blob} old The old image
 * @param {[number,number]} widthAndHeight The with and height of the new image
 * @returns Base 64 version
 */
function anyToPng(old, [width, height]) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const image = document.createElement("img");
    image.src = old;
    image.addEventListener("load", function (ev) {
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png").match(/(?<=data:.*,).*/)[0]);
    });
  });
}
const params = new Proxy(new URLSearchParams(window.location.search), {
  get(t, p) {
    return t.get(p);
  },
  set() {
    return false;
  },
});
const db = new apiV1();
