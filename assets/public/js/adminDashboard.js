if (!(localStorage.loggedIn === "true")) {
  window.location.href = "/login.html";
}
(async () => {
  const accountsManagerElement = document.getElementById("accountsManager");
  /*const premissionsResponce = await db.getPublicMedia(localStorage.username, [
    "premissions",
  ]);
  let premissions = {};
  if (premissionsResponce.type === 0) {
    premissions = premissionsResponce.value?.value ?? {};
  }
  const abilities = premissions.abilities ?? [];
  if (abilities.includes("admin")) {*/
  const infoRes = await db.getServerInfo(localStorage.token);
  console.log(infoRes);
  if (infoRes.type === 0) {
    // It worked!
    const { accounts } = infoRes.value.info;
    console;
    for (const username in accounts) {
      const account = accounts[username];
      const userPremissions = Object.entries(
        account?.premissions?.abilities ?? {}
      )
        .filter(([key, value]) => value === true)
        .map(([key]) => key);
      const accountHolder = document.createElement("div");
      accountHolder.className = "account";
      // Profile image
      const profileImage = document.createElement("img");
      profileImage.src =
        apiV1RestBase +
        `/account/getProfileImage?user=${encodeURIComponent(username)}`;
      profileImage.className = "profileImage";
      accountHolder.appendChild(profileImage);
      // Username element
      const usernameP = document.createElement("p");
      usernameP.textContent = username;
      usernameP.className = "username";
      accountHolder.appendChild(usernameP);
      // User type element
      const userTypeP = document.createElement("p");
      userTypeP.textContent = userPremissions.includes("admin")
        ? "admin"
        : userPremissions.includes("brodcast")
        ? "brodcast"
        : "user";
      userTypeP.className = "userType";
      accountHolder.appendChild(userTypeP);
      // Created at element
      const createdAtP = document.createElement("p");
      createdAtP.textContent = `Created at ${new Date(account.createdAt)}`;
      createdAtP.className = "createdAt";
      accountHolder.appendChild(createdAtP);
      // Actions element
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";
      function makeFunctionLink(text, func) {
        const element = document.createElement("p");
        element.textContent = text;
        element.addEventListener("click", function () {
          func(element);
        });
        return element;
      }
      actionsDiv.appendChild(
        makeFunctionLink("Delete user", function (elm) {
          accountHolder.remove();
        })
      );
      actionsDiv.appendChild(
        makeFunctionLink("Delete profile image", async function (elm) {
          await db.deleteExternalProfileImage(localStorage.token, username);
          profileImage.src = profileImage.src + "&1=1";
        })
      );
      let adminState = userPremissions.includes("admin");
      function toggleAdmin(elm) {
        adminState = !adminState;
        db.setPremissions(
          localStorage.token,
          username,
          "abilities.admin",
          adminState
        );
        if (adminState) {
          elm.textContent = "Revoke admin";
        } else {
          elm.textContent = "Give admin";
        }
      }
      if (adminState) {
        actionsDiv.appendChild(
          makeFunctionLink("Revoke admin", function (elm) {
            toggleAdmin(elm);
          })
        );
      } else {
        actionsDiv.appendChild(
          makeFunctionLink("Give admin", function (elm) {
            toggleAdmin(elm);
          })
        );
      }
      // Brodcasting
      let brodcastState = userPremissions.includes("brodcast");
      function toggleAdmin(elm) {
        brodcastState = !brodcastState;
        db.setPremissions(
          localStorage.token,
          username,
          "abilities.brodcast",
          brodcastState
        );
        if (brodcastState) {
          elm.textContent = "Revoke brodcast premission";
        } else {
          elm.textContent = "Give brodcast premission";
        }
      }
      if (brodcastState) {
        actionsDiv.appendChild(
          makeFunctionLink("Revoke brodcast premission", function (elm) {
            toggleAdmin(elm);
          })
        );
      } else {
        actionsDiv.appendChild(
          makeFunctionLink("Give brodcast premission", function (elm) {
            toggleAdmin(elm);
          })
        );
      }
      accountHolder.appendChild(actionsDiv);
      accountsManagerElement.appendChild(accountHolder);
    }
  } else {
    if (infoRes.value.errorReason === 4) {
      window.location.href = "/account.html";
    } else {
      console.log("Invalid session?");
      await checkSession();
    }
  }
  /*} else {
    window.location.href = "/account.html";
  }*/
})();
