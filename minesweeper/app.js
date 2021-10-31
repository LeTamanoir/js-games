let winSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;

const Game = {
  size: Math.floor(winSize / 40) * 40,
  cells: 40,
  ref: document.querySelector("#minesweeper"),
  replayRef: document.querySelector("#replay"),
  rangeRef: document.querySelector("#number-mines>span>span"),
  rangeInputRef: document.querySelector("#number-mines-input"),
  helpRef: document.querySelector("#help"),

  drawCanvas: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#eae0c8";
    ctx.fillRect(0, 0, Game.size, Game.size);

    ctx.fillStyle = "#ccb27b";
    for (let y = 0; y < Game.size + 2; y += Game.cells) {
      for (let x = 0; x < Game.size + 2; x += Game.cells) {
        ctx.fillRect(x + 2, y + 2, Game.cells - 4, Game.cells - 4);
      }
    }
  },

  play: () => {
    Game.drawCanvas();
  },

  init: () => {
    [Game.ref.height, Game.ref.width] = [Game.size, Game.size];
  },

  handleRightClick: (x, y) => {
    let mouseX = Math.floor(x / 40);
    let mouseY = Math.floor(y / 40);
    Bombs.spot(mouseX, mouseY);
    Game.checkWin();
  },

  handleClick: (x, y) => {
    let mouseX = Math.floor(x / 40);
    let mouseY = Math.floor(y / 40);
    Bombs.show(mouseX, mouseY);
    Game.checkWin();
  },

  checkWin: () => {
    let m = 0;
    let n = Bombs.checkedPos[0].length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        m += Bombs.checkedPos[i][j];
      }
    }
    if (m + Bombs.number != n ** 2) return;

    let ctx = Game.ref.getContext("2d");

    // ctx.fillStyle = "#eae0c8";
    // ctx.fillRect(0, 0, Game.size, Game.size);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "4rem Arial";
    ctx.fillText("🎉 You Won 🎉", Game.size / 2, Game.size / 2, Game.size);
    ctx.font = "2rem Arial";

    Game.replayRef.classList.add("show");
  },

  gameOver: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "4rem Arial";
    ctx.fillText("Game Over", Game.size / 2, Game.size / 2, Game.size);
    ctx.font = "2rem Arial";

    Game.replayRef.classList.add("show");
  },

  reset: () => {
    Game.replayRef.classList.remove("show");
    Bombs.found = 0;
    Bombs.positions = [];
    Bombs.checkedPos = [];
    Bombs.foundPos = [];
    Bombs.generate();
    Game.play();
  },

  helper: () => {
    let ctx = Game.ref.getContext("2d");
    let n = Math.floor(winSize / 40);

    ctx.textAlign = "center";
    ctx.font = "bold 25px Arial";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (Bombs.positions[y][x] == 0 && !Bombs.checkedPos[y][x]) {
          ctx.fillText("🟢", x * 40 + 20, y * 40 + 28, 40);
          return;
        }
      }
    }
  },

  resize: () => {
    Game.size = Math.floor(winSize / 40) * 40;
    Game.init();
    Game.reset();
  },
};

const Bombs = {
  positions: [],
  checkedPos: [],
  found: 0,
  number: 40,
  foundPos: [],

  spot: (x, y) => {
    let ctx = Game.ref.getContext("2d");

    if (!Bombs.checkedPos[y][x]) {
      if (Bombs.foundPos[y][x]) {
        if (Bombs.positions[y][x] == "b") Bombs.found--;
        Bombs.foundPos[y][x] = 0;
        ctx.fillStyle = "#ccb27b";
        ctx.fillRect(x * 40 + 2, y * 40 + 2, 40 - 4, 40 - 4);
      } else {
        if (Bombs.positions[y][x] == "b") Bombs.found++;
        Bombs.foundPos[y][x] = 1;
        ctx.fillStyle = "#eae0c8";
        ctx.fillRect(x * 40, y * 40, 40, 40);
        ctx.fillStyle = "#f00";
        ctx.textAlign = "center";
        ctx.text;
        ctx.font = "bold 25px Arial";
        ctx.fillText("🚩", x * 40 + 20, y * 40 + 28, 40);
      }
    }
  },

  show: async (x, y) => {
    let ctx = Game.ref.getContext("2d");
    let n = Math.floor(winSize / 40) - 1;

    ctx.fillStyle = "#eae0c8";
    ctx.fillRect(x * 40, y * 40, 40, 40);

    ctx.fillStyle = "#ccb27b";
    ctx.textAlign = "center";
    ctx.text;
    ctx.font = "bold 25px Arial";
    let b = Bombs.positions[y][x];
    let c = b == "b" ? "💣" : b != 0 ? b : "";
    ctx.fillText(c, x * 40 + 20, y * 40 + 28, 40);

    if (Bombs.positions[y][x] == "b") return Game.gameOver();
    else Bombs.checkedPos[y][x] = 1;

    if (Bombs.positions[y][x] == 0) {
      if (y - 1 >= 0)
        if (Bombs.positions[y - 1][x] != "b" && !Bombs.checkedPos[y - 1][x])
          Bombs.show(x, y - 1);
      if (y + 1 <= n)
        if (Bombs.positions[y + 1][x] != "b" && !Bombs.checkedPos[y + 1][x])
          Bombs.show(x, y + 1);
      if (x - 1 >= 0)
        if (Bombs.positions[y][x - 1] != "b" && !Bombs.checkedPos[y][x - 1])
          Bombs.show(x - 1, y);
      if (x + 1 <= n)
        if (Bombs.positions[y][x + 1] != "b" && !Bombs.checkedPos[y][x + 1])
          Bombs.show(x + 1, y);
      if (y + 1 <= n && x - 1 >= 0)
        if (
          Bombs.positions[y + 1][x - 1] != "b" &&
          !Bombs.checkedPos[y + 1][x - 1]
        )
          Bombs.show(x - 1, y + 1);
      if (y + 1 <= n && x + 1 <= n)
        if (
          Bombs.positions[y + 1][x + 1] != "b" &&
          !Bombs.checkedPos[y + 1][x + 1]
        )
          Bombs.show(x + 1, y + 1);
      if (y - 1 >= 0 && x + 1 <= n)
        if (
          Bombs.positions[y - 1][x + 1] != "b" &&
          !Bombs.checkedPos[y - 1][x + 1]
        )
          Bombs.show(x + 1, y - 1);
      if (y - 1 >= 0 && x - 1 >= 0)
        if (
          Bombs.positions[y - 1][x - 1] != "b" &&
          !Bombs.checkedPos[y - 1][x - 1]
        )
          Bombs.show(x - 1, y - 1);
    }
  },

  generate: () => {
    let i = 0;
    let n = Math.floor(winSize / 40);
    let m = n - 1;

    for (let y = 0; y < n; y++) {
      Bombs.positions.push([]);
      for (let x = 0; x < n; x++) Bombs.positions[y].push(0);
    }

    for (let y = 0; y < n; y++) {
      Bombs.foundPos.push([]);
      for (let x = 0; x < n; x++) Bombs.foundPos[y].push(0);
    }

    for (let y = 0; y < n; y++) {
      Bombs.checkedPos.push([]);
      for (let x = 0; x < n; x++) Bombs.checkedPos[y].push(0);
    }

    if (Bombs.number < m ** 2) {
      while (i < Bombs.number) {
        let x = Math.floor((Math.random() * Game.size) / 40);
        let y = Math.floor((Math.random() * Game.size) / 40);
        if (Bombs.positions[y][x] != "b") {
          Bombs.positions[y][x] = "b";
          i++;
        }
      }
    } else {
      alert(`Screen too small for ${Bombs.number} mines, try on a desktop`);
    }

    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (Bombs.positions[y][x] == "b") {
          if (y - 1 >= 0)
            if (Bombs.positions[y - 1][x] != "b") Bombs.positions[y - 1][x]++;
          if (y + 1 <= m)
            if (Bombs.positions[y + 1][x] != "b") Bombs.positions[y + 1][x]++;
          if (x - 1 >= 0)
            if (Bombs.positions[y][x - 1] != "b") Bombs.positions[y][x - 1]++;
          if (x + 1 <= m)
            if (Bombs.positions[y][x + 1] != "b") Bombs.positions[y][x + 1]++;
          if (y + 1 <= m && x - 1 >= 0)
            if (Bombs.positions[y + 1][x - 1] != "b")
              Bombs.positions[y + 1][x - 1]++;
          if (y + 1 <= m && x + 1 <= m)
            if (Bombs.positions[y + 1][x + 1] != "b")
              Bombs.positions[y + 1][x + 1]++;
          if (y - 1 >= 0 && x + 1 <= m)
            if (Bombs.positions[y - 1][x + 1] != "b")
              Bombs.positions[y - 1][x + 1]++;
          if (y - 1 >= 0 && x - 1 >= 0)
            if (Bombs.positions[y - 1][x - 1] != "b")
              Bombs.positions[y - 1][x - 1]++;
        }
      }
    }
  },
};

window.addEventListener("load", () => {
  Game.init();
  Bombs.generate();
  Game.play();
});

window.addEventListener("resize", () => {
  winSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  Game.resize();
});

Game.ref.addEventListener("click", (e) =>
  Game.handleClick(e.offsetX, e.offsetY)
);

Game.ref.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  Game.handleRightClick(e.offsetX, e.offsetY);
});

Game.replayRef.addEventListener("click", () => Game.reset());

Game.rangeInputRef.addEventListener("input", (e) => {
  Game.rangeRef.innerText = e.target.value;
  Bombs.number = parseInt(e.target.value);
  Game.reset();
});

Game.helpRef.addEventListener("click", () => Game.helper());
