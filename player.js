class Player {
  constructor(lane) {
    switch (lane) {
      case 1:
        this.x = lane1;
        break;
      case 3:
        this.x = lane3;
        break;
      case 2:
      default:
        this.x = lane2;
    }
    this.y = playHeight;
    this.lane = lane;
    this.s = 50;
    let options = {
      inputs: ['pLane', 'eLane', 'eDist', 'eType'],
      outputs: ['label'],
      task: 'classification',
      debug: 'true',
    };
    this.genes = [];
    this.newGenes = [];
    this.brain = ml5.neuralNetwork(options);
  }

  goLeft() {
    if (this.lane == 1) {
      return;
    } else {
      this.x -= 2 * lane1;
      this.lane--;
    }
  }

  goRight() {
    if (this.lane == 3) {
      return;
    } else {
      this.x += 2 * lane1;
      this.lane++;
    }
  }

  shoot() {
    bullets.push(new Bullet(player, 20));
  }

  update() {
    this.show();
    let s = this.look();
    if (s) {
      this.predict(s);
    }
  }

  show() {
    rect(this.x, this.y, this.s, this.s);
  }

  train() {
    if (this.newGenes.length == 0) {
      for (let i = 0; i < 200; i++) {
        let create = random() < 0.5;
        let inputs = {
          pLane: int(random(1, 4)),
          eLane: int(random(1, 4)),
          eDist: random(0, height - playHeight),
          eType: random([0, 1]),
        };

        let output = {
          label: random(actions),
        };
        this.genes.push(new Genome(inputs, output));
      }
    } else {
      this.genes = this.newGenes;
      this.newGenes = [];
    }
    this.genes.forEach((g) => {
      this.brain.addData(g.inputs, g.output);
    });
    this.brain.normalizeData();
    const trainingOptions = {
      epochs: 32,
      batchSize: 12,
    };
    this.brain.train(trainingOptions, this.finishedTraining);
  }

  finishedTraining() {
    gameState = 'playing';
  }

  look() {
    let npc = npcs[0] ?? null;
    if (!npc) return null;
    let s = {
      pLane: this.lane,
      eLane: npc.lane,
      eDist: npc.y,
      eType: npc.isEnemy ? 1 : 0,
    };
    return s;
  }

  predict(s) {
    this.brain.classify(s, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      let npc = npcs[0];
      let s = {
        pLane: this.lane,
        eLane: npc.lane,
        eDist: npc.y,
        eType: npc.isEnemy ? 1 : 0,
      };
      this.newGenes.push(new Genome(s, { label: result[0].label }));
      this.act(result[0]);
    });
  }

  handleResults(error, result) {
    if (error) {
      console.error(error);
      return;
    }
    let s = {
      pLane: this.lane,
      eLane: npc.lane,
      eDist: npc.y,
      eType: npc.isEnemy ? 1 : 0,
    };
    this.newGenes.push(new Genome(s, { label: result[0].label }));
    this.act(result[0]);
  }

  act(action) {
    switch (action.label) {
      case 'l':
        this.goLeft();
        break;
      case 'r':
        this.goRight();
        break;
      case 's':
        this.shoot();
        break;
      case 'n':
      default:
        break;
    }
  }
}
