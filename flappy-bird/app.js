const Game = {
  size: 700,
  ref: document.querySelector("#flappy-bird"),
  replayRef: document.querySelector("#replay"),
  scoreRef: document.querySelector("#score>span"),
  score: 0,
  isOver: false,

  drawCanvas: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#b3e0ff";
    ctx.fillRect(0, 0, Game.size, Game.size);

    ctx.fillStyle = "#33cc33";
    ctx.fillRect(0, 650, Game.size, 100);
  },

  play: (i) => {
    let iteration = i || 0;

    Game.drawCanvas();
    if (iteration % 100 == 0) Columns.generate();

    for (let i = 0; i < Columns.positions.length; i++) {
      Columns.positions[i].x -= 4;
      if (Columns.positions[i].x + Columns.positions[i].width < 0)
        Columns.positions.splice(i, 1);
    }

    if (Bird.jump) {
      if (Bird.oldJump < 20) {
        Bird.y -= 5;
        Bird.oldJump++;
      } else {
        Bird.jump = false;
        Bird.oldJump = 0;
      }
    } else {
      if (iteration % 2 == 0) {
        if (Bird.y + 5 < 660 - Bird.h) {
          Bird.y += 5 * Bird.oldJump;
          Bird.oldJump += 0.05;
        } else {
          Bird.y = 660 - Bird.h;
        }
      }
    }

    Game.scoreRef.innerText = Math.floor(Game.score / 30);
    Game.drawColumns();
    Game.drawBird();
    Game.checkColision();

    if (!Game.isOver) requestAnimationFrame(() => Game.play(iteration + 1));
  },

  drawColumns: () => {
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#8c8c8c";
    for (let i = 0; i < Columns.positions.length; i++) {
      let col = Columns.positions[i];
      ctx.fillRect(col.x, 0, col.width, col.start);
      ctx.fillRect(col.x, col.end, col.width, 700 - col.end - 50);
    }
  },

  checkColision: () => {
    for (let i = 0; i < Columns.positions.length; i++) {
      let col = Columns.positions[i];

      if (col.x > 100 - Bird.w && col.x < 100 + Bird.w)
        if (col.start > Bird.y || col.end < Bird.y) Game.gameOver();
        else Game.score++;
    }
  },

  drawBird: () => {
    let ctx = Game.ref.getContext("2d");
    ctx.drawImage(Bird.image, 100, Bird.y, Bird.w, Bird.h);
  },

  gameOver: () => {
    Game.isOver = true;
    let ctx = Game.ref.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "4rem Arial";
    ctx.fillText("Game Over", Game.size / 2, Game.size / 2, Game.size);
    ctx.font = "2rem Arial";

    Game.replayRef.classList.add("show");
  },

  init: () => {
    [Game.ref.height, Game.ref.width] = [Game.size, Game.size];
  },

  reset: () => {
    Game.replayRef.classList.remove("show");
    Game.score = 0;
    Game.isOver = false;
    Bird.y = Game.size / 2;
    Columns.positions = [];
    Game.play();
  },
};

const image = new Image(629, 444);
image.src = "bird.png";

const Bird = {
  y: Game.size / 2,
  w: 629 / 10,
  h: 444 / 10,
  jump: false,
  oldJump: 0,
  image,
};

const Columns = {
  positions: [],
  generate: () => {
    let start = Math.floor(Math.random() * (Game.size / 2) + 50);
    let end = start + 200;
    let width = Math.floor(Math.random() * 20 + 60);
    Columns.positions.push({
      start,
      end,
      width,
      x: 700,
    });
  },
};

window.addEventListener("load", () => {
  Game.init();
  Game.play();
});

window.addEventListener("keydown", (e) => {
  if (e.code == "Space") Bird.jump = true;
});

Game.ref.addEventListener("click", () => (Bird.jump = true));

Game.replayRef.addEventListener("click", () => Game.reset());
