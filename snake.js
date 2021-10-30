let winSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;

const Game = {
  size: Math.floor(winSize / 40) * 40,
  cells: 40,
  ref: document.querySelector("#snake"),
  speed: 200,
  score: 0,
  replayRef: document.querySelector("#replay"),
  scoreRef: document.querySelector("#score>span"),

  drawCanvas: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#eae0c8";
    ctx.fillRect(0, 0, Game.size, Game.size);

    ctx.fillStyle = "#ccb27b";
    for (let y = 0; y < Game.size; y += Game.cells) {
      for (let x = 0; x < Game.size; x += Game.cells) {
        ctx.fillRect(x + 2, y + 2, Game.cells - 4, Game.cells - 4);
      }
    }
  },

  drawSnake: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#00b300";
    ctx.fillRect(
      Snake.x * Game.cells,
      Snake.y * Game.cells,
      Game.cells,
      Game.cells
    );

    ctx.fillStyle = "#00e600";
    for (let i = 0; i < Snake.tail.length; i++) {
      ctx.fillRect(
        Snake.tail[i][0] * Game.cells,
        Snake.tail[i][1] * Game.cells,
        Game.cells,
        Game.cells
      );
    }
  },

  drawApple: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#ff1a1a";
    ctx.fillRect(
      Apple.x * Game.cells,
      Apple.y * Game.cells,
      Game.cells,
      Game.cells
    );
  },

  checkDead: () => {
    if (
      Snake.x > Math.floor(winSize / 40) - 1 ||
      Snake.x < 0 ||
      Snake.y < 0 ||
      Snake.y > Math.floor(winSize / 40) - 1
    ) {
      return true;
    }
    for (let i = 0; i < Snake.tail.length; i++) {
      if (Snake.tail[i][0] == Snake.x && Snake.tail[i][1] == Snake.y) {
        return true;
      }
    }
    return false;
  },

  init: () => {
    Game.scoreRef.innerText = Game.score;
    [Game.ref.height, Game.ref.width] = [Game.size, Game.size];
  },

  play: () => {
    Game.drawCanvas();
    Game.drawApple();

    if (Snake.direction[0] != 0 || Snake.direction[1] != 0) {
      Snake.moov();
    }

    Game.drawSnake();

    if (Snake.x === Apple.x && Snake.y === Apple.y) {
      Game.speed -= 5;
      Game.score += 1;
      Snake.length += 1;
      Apple.respawn();
      Game.scoreRef.innerText = Game.score;
    }

    if (Game.checkDead()) {
      Game.gameOver();
    } else {
      setTimeout(() => {
        Game.play();
        Snake.captureCtx = true;
      }, Game.speed);
    }
  },

  reset: () => {
    Game.replayRef.classList.remove("show");

    Snake.x = parseInt(Game.size / 40 / 2);
    Snake.y = parseInt(Game.size / 40 / 2);
    Snake.length = 0;
    Snake.direction = [0, 0];
    Snake.tail = [];

    Game.score = 0;
    Game.speed = 200;

    Apple.respawn();
    Game.play();
  },

  gameOver: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#eae0c8";
    ctx.fillRect(0, 0, Game.size, Game.size);
    ctx.fillStyle = "#ccb27b";
    ctx.textAlign = "center";
    ctx.font = "4rem Arial";
    ctx.fillText("Game Over", Game.size / 2, Game.size / 2, Game.size);
    ctx.font = "2rem Arial";
    ctx.fillText(
      `Score : ${Game.score}`,
      Game.size / 2,
      Game.size / 1.75,
      Game.size
    );

    Game.replayRef.classList.add("show");
  },

  resize: () => {
    Game.size = Math.floor(winSize / 40) * 40;
    Game.init();
  },
};

const Snake = {
  x: parseInt(Game.size / 40 / 2),
  y: parseInt(Game.size / 40 / 2),
  direction: [0, 0],
  length: 0,
  tail: [],
  captureCtx: 0,
  moov: () => {
    Snake.tail.splice(0, 0, [Snake.x, Snake.y]);
    Snake.tail = Snake.tail.filter((e, i) => (i < Snake.length ? e : null));

    Snake.x += Snake.direction[0];
    Snake.y += Snake.direction[1];
  },
};

const Apple = {
  x: 0,
  y: 0,
  respawn: () => {
    let x = Math.floor((Math.random() * Game.size) / 40);
    let y = Math.floor((Math.random() * Game.size) / 40);

    if (x == Snake.x && y == Snake.y) {
      return Apple.respawn();
    }
    for (let i = 0; i < Snake.tail.length; i++) {
      if (x == Snake.tail[i][0] && y == Snake.tail[i][1]) {
        return Apple.respawn();
      }
    }
    [Apple.x, Apple.y] = [x, y];
  },
};

window.addEventListener("load", () => {
  Game.init();
  Apple.respawn();
  Game.play();
});

window.addEventListener("resize", () => {
  winSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  Game.resize();
});

window.addEventListener("keydown", (e) => {
  let key = e.code;

  if (Snake.captureCtx) {
    if (key == "KeyW" && Snake.direction[1] == 0) {
      Snake.direction = [0, -1];
      Snake.captureCtx = false;
    } else if (key == "KeyS" && Snake.direction[1] == 0) {
      Snake.direction = [0, 1];
      Snake.captureCtx = false;
    } else if (key == "KeyA" && Snake.direction[0] == 0) {
      Snake.direction = [-1, 0];
      Snake.captureCtx = false;
    } else if (key == "KeyD" && Snake.direction[0] == 0) {
      Snake.direction = [1, 0];
      Snake.captureCtx = false;
    }
  }
});

Game.replayRef.addEventListener("click", () => Game.reset());
