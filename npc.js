class Npc {
  constructor(lane, isEnemy, v) {
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
    this.y = 0;
    this.v = v;
    this.s = 50;
    this.lane = lane;
    this.isEnemy = isEnemy;
    this.isShootable = true;
  }

  update() {
    this.y = lerp(this.y, this.y + this.v, 1);
    if (this.y - this.s / 2 > playHeight - this.s / 2) {
      this.isShootable = false;
    }
    this.show();
  }

  show() {
    push();
    if (this.isEnemy) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 0);
    }
    rect(this.x, this.y, this.s, this.s);
    pop();
  }

  onCanvas() {
    if (this.y < height + buffer) {
      return true;
    }
    return false;
  }
}
