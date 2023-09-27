// Actions Stack for Undo
let actions = [];

// Safely execute functions
function safeExecute(fn) {
  try {
    fn();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function pushAction(action) {
  actions.push(action);
}

function setBatsman1(name) {
  safeExecute(() => {
    localStorage.setItem("batsman1-name", name);
    pushAction({ type: "setBatsman1", value: name });
  });
}

function setBatsman2(name) {
  safeExecute(() => {
    localStorage.setItem("batsman2-name", name);
    pushAction({ type: "setBatsman2", value: name });
  });
}

function setTeamName(name) {
  safeExecute(() => {
    localStorage.setItem("team-name", name);
    pushAction({ type: "setTeamname", value: name });
  });
}

function setBowler(name) {
  safeExecute(() => {
    // पिछले बौलर की जानकारी संग्रहित करना
    let prevBowler = localStorage.getItem("bowler-name");
    let prevBowlerRun = localStorage.getItem("bowler-run");
    let prevBowlerWicket = localStorage.getItem("bowler-wicket");

    localStorage.setItem("bowler-name", name);
    localStorage.setItem("bowler-run", "0");
    localStorage.setItem("bowler-wicket", "0");

    // क्रिया को स्टैक में पुश करना
    pushAction({
      type: "setBowler",
      value: name,
      prevBowler: prevBowler,
      prevBowlerRun: prevBowlerRun,
      prevBowlerWicket: prevBowlerWicket,
    });
  });
}

function updateScore(runs) {
  safeExecute(() => {
    let onStrikeBatsman = localStorage.getItem("onStrikeBatsman") || "batsman1";
    let batsmanRunKey = onStrikeBatsman + "-run";
    let currentRun = parseInt(localStorage.getItem(batsmanRunKey) || "0");
    currentRun += runs;
    localStorage.setItem(batsmanRunKey, currentRun.toString());

    let batsmanBallKey = onStrikeBatsman + "-ball";
    let currentBalls = parseInt(localStorage.getItem(batsmanBallKey) || "0");
    currentBalls += 1;
    localStorage.setItem(batsmanBallKey, currentBalls.toString());

    let totalRun = parseInt(localStorage.getItem("team-run") || "0");
    totalRun += runs;
    localStorage.setItem("team-run", totalRun.toString());

    let bowlerRun = parseInt(localStorage.getItem("bowler-run") || "0");
    bowlerRun += runs;
    localStorage.setItem("bowler-run", bowlerRun.toString());

    let totalBalls = parseInt(localStorage.getItem("total-balls") || "0");
    totalBalls += 1;
    localStorage.setItem("total-balls", totalBalls.toString());

    let bowlerBalls = parseInt(localStorage.getItem("bowler-balls") || "0");
    bowlerBalls += 1;
    localStorage.setItem("bowler-balls", bowlerBalls.toString());

    if ([1, 3].includes(runs) || bowlerBalls === 6) {
      changeStrike();
    }

    if (bowlerBalls === 6) {
      changeBowler();
    }

    pushAction({ type: "updateScore", value: runs });
  });
}

function changeStrike() {
  safeExecute(() => {
    let onStrikeBatsman = localStorage.getItem("onStrikeBatsman") || "batsman1";
    let newOnStrike = onStrikeBatsman === "batsman1" ? "batsman2" : "batsman1";

    pushAction({
      type: "changeStrike",
      prevOnStrike: onStrikeBatsman,
    });

    localStorage.setItem("onStrikeBatsman", newOnStrike);
  });
}

function changeBowler() {
  safeExecute(() => {
    // पिछले बौलर की जानकारी संग्रहित करना
    let prevBowler = localStorage.getItem("bowler-name");
    let prevBowlerRun = localStorage.getItem("bowler-run");
    let prevBowlerWicket = localStorage.getItem("bowler-wicket");
    let newBowlerName = prompt("Enter new bowler's name:");

    // अगर उपयोगकर्ता बिना नाम डाले कैंसल कर देता है, तो बौलर को बदलें नहीं
    if (!newBowlerName) return;

    localStorage.setItem("bowler-name", newBowlerName);
    localStorage.setItem("bowler-run", "0");
    localStorage.setItem("bowler-wicket", "0");
    localStorage.setItem("bowler-balls", "0"); // यदि आप बौलर के गेंदों की गिनती कर रहे हैं तो

    // क्रिया को स्टैक में पुश करना
    pushAction({
      type: "changeBowler",
      newBowler: newBowlerName,
      prevBowler: prevBowler,
      prevBowlerRun: prevBowlerRun,
      prevBowlerWicket: prevBowlerWicket,
    });
    changeStrike();
  });
}

function bowlerWicket() {
  safeExecute(() => {
    let onStrikeBatsman = localStorage.getItem("onStrikeBatsman") || "batsman1";
    let newName = prompt(`${onStrikeBatsman} is out. Enter new name:`);
    localStorage.setItem(onStrikeBatsman + "-name", newName);
    localStorage.setItem(onStrikeBatsman + "-run", "0");
    localStorage.setItem(onStrikeBatsman + "-ball", "0");
    let elem = document.getElementById(onStrikeBatsman + "-section");
    if (elem) {
      elem.style.opacity = 0.5;
    }
    changeStrike();

    let bowlerWickets = parseInt(localStorage.getItem("bowler-wicket") || "0");
    bowlerWickets += 1;
    localStorage.setItem("bowler-wicket", bowlerWickets.toString());

    let teamWickets = parseInt(localStorage.getItem("team-wicket") || "0");
    teamWickets += 1;
    localStorage.setItem("team-wicket", teamWickets.toString());

    pushAction({ type: "bowlerWicket", batsman: onStrikeBatsman });
    // updateDisplay();
  });
}

function updateExtraRun(runs, type) {
  safeExecute(() => {
    let totalRun = parseInt(localStorage.getItem("team-run") || "0");
    totalRun += runs;
    localStorage.setItem("team-run", totalRun.toString());

    if (type === "wide" || type === "noball") {
      let bowlerRun = parseInt(localStorage.getItem("bowler-run") || "0");
      bowlerRun += runs;
      localStorage.setItem("bowler-run", bowlerRun.toString());
    }

    pushAction({ type: "extraRun", runs: runs, runType: type });
  });
}

// function updateBallStatus(status, color) {
//   const ballStatusElem = document.getElementById("ball-status");
//   const circle = document.createElement("div");
//   circle.style.backgroundColor = color;
//   circle.style.borderRadius = "50%";
//   circle.style.width = "20px";
//   circle.style.height = "20px";
//   circle.style.textAlign = "center";
//   circle.innerText = status;

//   ballStatusElem.appendChild(circle);
// }

function resetGame() {
  safeExecute(() => {
    const keys = [
      "batsman1-name",
      "batsman1-run",
      "batsman1-ball",
      "batsman2-name",
      "batsman2-run",
      "batsman2-ball",
      "team-name",
      "team-run",
      "team-wicket",
      "bowler-name",
      "bowler-run",
      "bowler-wicket",
      "onStrikeBatsman",
      "total-balls",
      "bowler-balls",
    ];
    let previousValues = {};

    // सभी मौजूदा मान को संग्रहित करें
    keys.forEach((key) => {
      previousValues[key] = localStorage.getItem(key);
    });

    // अब सभी मान को रीसेट करें
    keys.forEach((key) => {
      if (["team-wicket", "bowler-wicket"].includes(key)) {
        localStorage.setItem(key, "0"); // wickets should be set to zero
      } else if (
        [
          "batsman1-run",
          "batsman2-run",
          "team-run",
          "bowler-run",
          "batsman1-ball",
          "batsman2-ball",
          "total-balls",
          "bowler-balls",
        ].includes(key)
      ) {
        localStorage.setItem(key, "0"); // runs and balls should be set to zero
      } else {
        localStorage.setItem(key, ""); // अन्य सभी मान को खाली सेट करें
      }
    });

    // क्रिया को स्टैक में पुश करना
    pushAction({ type: "resetGame", previousValues: previousValues });
  });
}

function undoLastAction() {
  safeExecute(() => {
    let lastAction = actions.pop(); // अंतिम क्रिया को पॉप करें

    if (!lastAction) return; // कोई पिछली क्रिया नहीं है

    switch (lastAction.type) {
      case "setBatsman1":
      case "setBatsman2":
      case "setTeamname":
      case "setBowler":
        localStorage.setItem(lastAction.type, lastAction.prevValue || "");
        break;

      case "updateScore":
        let batsmanRunKey = lastAction.onStrikeBatsman + "-run";
        let currentRun = parseInt(localStorage.getItem(batsmanRunKey) || "0");
        localStorage.setItem(
          batsmanRunKey,
          (currentRun - lastAction.value).toString()
        );

        let totalRun = parseInt(localStorage.getItem("team-run") || "0");
        localStorage.setItem(
          "team-run",
          (totalRun - lastAction.value).toString()
        );

        let bowlerRun = parseInt(localStorage.getItem("bowler-run") || "0");
        localStorage.setItem(
          "bowler-run",
          (bowlerRun - lastAction.value).toString()
        );
        break;

      case "changeStrike":
        let currentOnStrike = localStorage.getItem("onStrikeBatsman");
        let newOnStrike =
          currentOnStrike === "batsman1" ? "batsman2" : "batsman1";
        localStorage.setItem("onStrikeBatsman", newOnStrike);
        break;

      case "bowlerWicket":
        let bowlerWickets = parseInt(localStorage.getItem("bowler-wicket"));
        localStorage.setItem("bowler-wicket", (bowlerWickets - 1).toString());

        let teamWickets = parseInt(localStorage.getItem("team-wicket"));
        localStorage.setItem("team-wicket", (teamWickets - 1).toString());
        break;

      case "extraRun":
        let extraTotalRun = parseInt(localStorage.getItem("team-run"));
        localStorage.setItem(
          "team-run",
          (extraTotalRun - lastAction.runs).toString()
        );

        if (lastAction.runType === "wide" || lastAction.runType === "noball") {
          let extraBowlerRun = parseInt(
            localStorage.getItem("bowler-run") || "0"
          );
          localStorage.setItem(
            "bowler-run",
            (extraBowlerRun - lastAction.runs).toString()
          );
        }
        break;

      case "changeBowler":
        localStorage.setItem("bowler-name", lastAction.prevBowler);
        localStorage.setItem("bowler-run", lastAction.prevBowlerRun);
        localStorage.setItem("bowler-wicket", lastAction.prevBowlerWicket);
        break;

      case "resetGame":
        // यहाँ पर सभी स्थानीय स्टोरेज मान वापस सेट कर दिए जाते हैं
        for (let key in lastAction.previousValues) {
          localStorage.setItem(key, lastAction.previousValues[key]);
        }
        break;

      case "updateExtraRun":
        let updatedTotalRun = parseInt(localStorage.getItem("team-run"));
        localStorage.setItem(
          "team-run",
          (updatedTotalRun - lastAction.runs).toString()
        );

        if (lastAction.runType === "wide" || lastAction.runType === "noball") {
          let updatedBowlerRun = parseInt(
            localStorage.getItem("bowler-run") || "0"
          );
          localStorage.setItem(
            "bowler-run",
            (updatedBowlerRun - lastAction.runs).toString()
          );
        }
        break;
    }
  });
}
