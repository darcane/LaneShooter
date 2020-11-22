class Bullet {
  constructor(player, v) {
    switch (player.lane) {
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
    this.y = player.y;
    this.v = v;
    this.w = 5;
    this.h = 20;
  }

  update() {
    this.y = lerp(this.y, this.y - this.v, 1);
    this.show();
  }

  show() {
    rect(this.x, this.y, this.w, this.h);
  }

  intersects(npcs) {
    for (let i = 0; i < npcs.length; i++) {
      let npc = npcs[i];
      if (npc.x !== this.x) {
        continue;
      } else if ((npc.y + npc.s / 2 > this.y) & npc.isShootable) {
        return i;
      }
    }
    return -1;
  }

  onCanvas() {
    if (this.y > 0 - buffer) {
      return true;
    }
    return false;
  }
}
