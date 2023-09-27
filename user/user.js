function safeExecute(func) {
  try {
    func();
  } catch (error) {
    console.error(`Error executing function: ${error}`);
  }
}

function updateDisplay() {
  safeExecute(() => {
    // Batsmen जानकारी
    document.getElementById("batsman1-name").innerText =
      localStorage.getItem("batsman1-name") || "Batsman 1";
    document.getElementById("batsman1-run").innerText =
      localStorage.getItem("batsman1-run") || "0";
    document.getElementById("batsman1-ball").innerText =
      localStorage.getItem("batsman1-ball") || "0";

    document.getElementById("batsman2-name").innerText =
      localStorage.getItem("batsman2-name") || "Batsman 2";
    document.getElementById("batsman2-run").innerText =
      localStorage.getItem("batsman2-run") || "0";
    document.getElementById("batsman2-ball").innerText =
      localStorage.getItem("batsman2-ball") || "0";

    // Bowler जानकारी
    document.getElementById("bowler-name").innerText =
      localStorage.getItem("bowler-name") || "Bowler";
    document.getElementById("bowler-run").innerText =
      localStorage.getItem("bowler-run") || "0";
    document.getElementById("bowler-wicket").innerText =
      localStorage.getItem("bowler-wicket") || "0";

    // Team जानकारी
    document.getElementById("team-name").innerText =
      localStorage.getItem("team-name") || "Batting Team";
    document.getElementById("team-run").innerText =
      localStorage.getItem("team-run") || "0";
    document.getElementById("team-wicket").innerText =
      localStorage.getItem("team-wicket") || "0";

    // Over की गणना
    let totalBalls = parseInt(localStorage.getItem("total-balls") || "0");
    let overs = Math.floor(totalBalls / 6);
    let remainingBalls = totalBalls % 6;
    document.getElementById(
      "team-over"
    ).innerText = `${overs}.${remainingBalls} Overs`;

    // Strike rotation जानकारी
    let onStrikeBatsman = localStorage.getItem("onStrikeBatsman") || "batsman1";
    if (onStrikeBatsman === "batsman1") {
      document.getElementById("batsman1-name").innerText =
        "▶ " + (localStorage.getItem("batsman1-name") || "Batsman 1");
    } else {
      document.getElementById("batsman2-name").innerText =
        "▶ " + (localStorage.getItem("batsman2-name") || "Batsman 2");
    }
  });
}

// जब storage में कोई बदलाव होता है
window.addEventListener("storage", function (event) {
  if (
    [
      "batsman1-name",
      "batsman1-run",
      "batsman1-ball",
      "batsman2-name",
      "batsman2-run",
      "batsman2-ball",
      "team-name",
      "bowler-name",
      "bowler-run",
      "bowler-wicket",
      "team-run",
      "team-wicket",
      "total-balls",
    ].includes(event.key)
  ) {
    updateDisplay();
  }
});

// पेज लोड होने पर display अपडेट हो
updateDisplay();
