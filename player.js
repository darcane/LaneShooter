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

  update() {
    this.show();
  }

  show() {
    rect(this.x, this.y, this.s, this.s);
  }
}
