let lane1, lane2, lane3, playHeight;
let bullets = [];
let npcs = [];
let player;
let buffer = 50;
let score, freq, speed, health, level;
let maxFreq = 0.03;
let gameState = 'start';
let actions = ['l', 'r', 's', 'n'];
let generation = 1;
let iteration = 1;
let genePool = [];
let bufferPool = [];

function setup() {
  createCanvas(600, 1200);
  textSize(25);
  textAlign(LEFT, CENTER);
  noStroke();
  rectMode(CENTER);
  lane1 = width / (3 * 2);
  lane2 = 3 * lane1;
  lane3 = 5 * lane1;
  playHeight = (height * 9) / 10;

  createNewGame();
}

function createNewGame() {
  freq = 0.01; //0.005
  speed = 15; //4
  health = 5;
  level = 1;
  gameState = 'training';

  let gene = null;
  if (bufferPool.length > 0) {
    gene = random(bufferPool);
  }
  score = 0;
  player = new Player(2, gene ?? null);
  player.train();
}

function draw() {
  drawHud();
  if (gameState === 'playing') {
    if (health > 0) {
      game();
    } else {
      gameOver();
    }
  } else if (gameState === 'training') {
    push();
    fill(200, 200, 0);
    textAlign(CENTER, CENTER);
    text(`TRAINING NEW GEN`, width / 2, height / 2);
    pop();
  }
}

function game() {
  player.update();
  checkBullets();
  spawnNpc();
  checkNpcs();
  adjustLevel();
}

function gameOver() {
  push();
  fill(200, 200, 0);
  textAlign(CENTER, CENTER);
  text(`GAME OVER`, width / 2, height / 2);
  text(`Your score : ${score}`, width / 2, height / 2 + 50);
  pop();

  if (player && player.newGenes.length > 0) {
    genePool.push({
      score: score,
      genes: player.newGenes,
    });
  }
  if (iteration == 40) {
    iteration = 0;
    generation++;
    genePool.sort(function (a, b) {
      return b.score - a.score;
    });
    genePool.splice(int(genePool.length / 2), int(genePool.length / 2));
    bufferPool = genePool;
    genePool = [];
    createNewGame();
  } else {
    iteration++;
    createNewGame();
  }
  // noLoop();
}

function drawHud() {
  background(51);
  drawLanes();
  text(score, width / 10, 40);
  text(`Level ${level}`, width / 10, height - 40);
  push();
  textAlign(RIGHT, CENTER);
  text(`Health ${health}`, (width * 9) / 10, height - 40);
  text(`Iteration: ${iteration}`, (width * 9) / 10, 40);
  text(`Gen: ${generation}`, (width * 9) / 10, 80);
  pop();
}

function drawLanes() {
  stroke(200);
  line(width / 3, 0, width / 3, height);
  line((width * 2) / 3, 0, (width * 2) / 3, height);
  push();
  stroke(0, 0, 150, 40);
  line(0, playHeight - player.s / 2, width, playHeight - player.s / 2);

  pop();
}

function checkBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    let n = bullets[i].intersects(npcs);
    if (n != -1) {
      if (npcs[n].isEnemy) {
        score += 50;
      } else {
        score -= 500;
        health--;
      }
      npcs.splice(n, 1);
      bullets.splice(i, 1);
      i--;
    } else if (!bullets[i].onCanvas()) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

function adjustLevel() {
  if (frameCount % 700 == 0) {
    speed *= 1.1;
    freq = min(maxFreq, freq * 1.1);
    level++;
  }
}

function spawnNpc() {
  if (random() < freq) {
    let isEnemy = random() > 0.1;
    npcs.push(new Npc(int(random(1, 4)), isEnemy, speed));
  }
}

function checkNpcs() {
  for (let i = 0; i < npcs.length; i++) {
    npcs[i].update();
    if (!npcs[i].onCanvas()) {
      if (!npcs[i].isEnemy) {
        score += 100;
      } else {
        score -= 100;
        health--;
      }
      npcs.splice(i, 1);
      i--;
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    player.shoot();
  } else if (keyCode == LEFT_ARROW) {
    player.goLeft();
  } else if (keyCode == RIGHT_ARROW) {
    player.goRight();
  }
}

function mouseClicked() {
  console.log(`x: ${mouseX} - y: ${mouseY}`);
}
