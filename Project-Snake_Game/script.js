function init() {
  canvas = document.getElementById("g_canvas");
  W = canvas.width = 1000;
  H = canvas.height = 1000;
  pen = canvas.getContext("2d");
  score = 0;
  game_over = false;
  cs = 66;

  pen.fillStyle = "black";
  pen.font = "50px Roboto";
  pen.fillText('To play Press "Spacebar" key', 150, 50);

  // creating images
  food_img = new Image();
  food_img.src = "./assets/apple.png";

  food = getRandomFood();

  //create 1st snake
  snake = {
    initial_len: 3,
    color: "blue",
    body: [],
    dir: "right",

    createSnake: function () {
      for (let i = this.initial_len; i > 0; i--) {
        this.body.push({ x: i, y: 0 });
      }
    },

    drawSnake: function () {
      for (let i = 0; i < this.body.length; i++) {
        pen.fillStyle = this.color;
        pen.fillRect(this.body[i].x * cs, this.body[i].y * cs, cs - 3, cs - 3);
      }
    },

    updateSnake: function () {
      let headX = this.body[0].x;
      let headY = this.body[0].y;
      if (food.x == headX && food.y == headY) {
        food = getRandomFood();
        score++;
      } else {
        this.body.pop();
      }

      let nextX, nextY;
      if (this.dir == "right") {
        nextX = headX + 1;
        nextY = headY;
      } else if (this.dir == "left") {
        nextX = headX - 1;
        nextY = headY;
      } else if (this.dir == "up") {
        nextX = headX;
        nextY = headY - 1;
      } else if (this.dir == "down") {
        nextX = headX;
        nextY = headY + 1;
      }

      this.body.unshift({ x: nextX, y: nextY });

      // Logic to prevent snake going out

      var lastX = Math.round(W / cs);
      var lastY = Math.round(H / cs);

      if (
        this.body[0].x < 0 ||
        this.body[0].y < 0 ||
        this.body[0].x > lastX ||
        this.body[0].y > lastY
      ) {
        game_over = true;
      }
    },
  };

  snake.createSnake();

  function keypress(e) {
    if (e.key == "ArrowRight" && snake.dir != "left") {
      snake.dir = "right";
    } else if (e.key == "ArrowLeft" && snake.dir != "right") {
      snake.dir = "left";
    } else if (e.key == "ArrowUp" && snake.dir != "down") {
      snake.dir = "up";
    } else if (e.key == "ArrowDown" && snake.dir != "up") {
      snake.dir = "down";
    }
  }

  document.addEventListener("keydown", keypress);
}

function draw() {
  // clearing old frame
  pen.clearRect(0, 0, W, H);
  snake.drawSnake();

  pen.fillStyle = food.color;
  pen.drawImage(food_img, food.x * cs, food.y * cs, cs, cs);
  document.getElementById("score").innerHTML = "Score = " + score;
}

function update() {
  snake.updateSnake();
}

function getRandomFood() {
  var foodX = Math.round((Math.random() * (W - cs)) / cs);
  var foodY = Math.round((Math.random() * (H - cs)) / cs);

  var food = {
    x: foodX,
    y: foodY,
    color: "red",
  };
  return food;
}

function gameloop() {
  if (game_over == true) {
    clearInterval(f);
    pen.fillStyle = "grey";
    for (let i = 0; i < snake.body.length; i++) {
      pen.fillRect(snake.body[i].x * cs, snake.body[i].y * cs, cs - 3, cs - 3);
    }
    pen.fillStyle = "black";
    pen.font = "50px Roboto";
    pen.fillText('Game Over,To Replay Press "Enter" key', 150, 50);
    document.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        this.location.reload();
      }
    });

    return;
  }
  draw();
  update();
}

init();
document.addEventListener("keydown", play);
function play(e) {
  if (e.keyCode == 32) f = setInterval(gameloop, 100);
}

var f;
