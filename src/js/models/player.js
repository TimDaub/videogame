//@format
const defaultAssetName = "playerIdleRight";
const playerSpeed = 5;
let prevVx = 1;

export default class Player {
  constructor(w, h, x, y, vx, vy, respawn, assets) {
    this.spawnX = x;
    this.spawnY = y;
    this.respawn = respawn;
    this.health = 100;

    this.w = w;
    this.h = h;

    this.x = x;
    this.y = y;

    this.vx = vx;
    this.vy = vy;

    this.weight = 0.8;

    this.assets = assets;
    this.currentAsset = this.assets[defaultAssetName];

    this.ticksPerFrame = this.currentAsset.tickSpeed;
    this.currentTick = 0;
    this.ticks = 0;

    this.initControls();
  }

  initControls() {
    // Walk intervals are used to continuously set the player's walking
    // speed, while an arrow key is pressed.
    let left = [];
    let right = [];
    let reset = intervals => {
      intervals.map(clearInterval);
      // We return an empty list to reset the given list of intervals
      return [];
    };
    let walk = speed => {
      // We call this.walk here to have the player immediately react to
      // a key down event (and not with a delay of a few milliseconds
      this.walk(speed);
      return setInterval(() => this.walk(speed), 5);
    };

    document.onkeydown = e => {
      e = e || window.event;

      if (e.keyCode === 32) {
        this.jump(-14);
      }
      if (e.keyCode === 37 || e.keyCode === 65) {
        left.push(walk(-1 * playerSpeed));
      }
      if (e.keyCode === 39 || e.keyCode === 68) {
        right.push(walk(playerSpeed));
      }
    };

    document.onkeyup = e => {
      e = e || window.event;
      // Once a key press in a certain direction was cleared, we
      // completely whipe all intervals and reset the list to empty.

      if (e.keyCode === 37 || e.keyCode === 65) {
        left = reset(left);
        this.walk(0);
      }
      if (e.keyCode === 39 || e.keyCode === 68) {
        right = reset(right);
        this.walk(0);
      }
    };
  }

  revive(health) {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.health = 100;
  }

  jump(vy) {
    if (this.vy === 0) {
      this.vy = vy;
    }
  }

  walk(vx) {
    this.vx = vx;
  }

  update(dt) {
    this.updateAnimation();
    let tiles = window.globals.map.tiles;

    // General idea for collisions:
    // Calculate the future x and y values, see if they collide with
    // anything (formerly, we did that at the beginning of this method and
    // had to correct afterwards - made the code super hard to change!), if
    // they collide, set position to exactly the colliding point and allow
    // movements away, but not towards the collision.

    // Gravity calculation, modified a bit for fun
    this.vy += (window.globals.gravity / this.weight) * Math.sqrt(dt, 2);

    // future position values
    let fx = this.x + this.vx;
    let fy = this.y + this.vy;

    tiles.forEach(tile => {
      // Check if there is any collision
      let collisions = tile.collide(fx, fy, this.w, this.h);
      if (collisions) {
        // Retrieve the value that is closest to zero
        let side = Object.keys(collisions)
          .sort(
            (a, b) =>
              Math.abs(collisions[a]) > Math.abs(collisions[b]) ? 1 : -1
          )
          .shift();

        // and depending on the outcome, set the players movement to
        // zero
        let { left, right, bottom, top } = collisions;
        if (side === "bottom" && left > 30 && right > 30) {
          // player standing on prop
          this.y = tile.y - this.h;
          this.vy = 0;
        }
        if (side === "top") {
          // TODO: Currently disabled
          //this.vy = 0 // player hitting its head
        }
        if (side === "left") {
          this.x = tile.x - this.w;
          this.vx = 0;
        }
        if (side === "right") this.vx = 0;
      }
    });

    this.x += this.vx;
    this.y += this.vy;

    if (this.health <= 0 && this.respawn) {
      this.revive(100);
    }
    // NOTE: If player is out of screen's height, kill it.
    if (this.y >= window.globals.world.screen.height) {
      this.health = 0;
    }
  }

  updateAnimation() {
    this.ticks += 1;
    if (this.ticks > this.ticksPerFrame) {
      this.ticks = 0;
      this.currentTick += 1;
      if (this.currentTick === this.currentAsset.numOfFrames) {
        this.currentTick = 0;
      }
    }

    this.ticksPerFrame = this.currentAsset.tickSpeed;
  }

  render() {
    if (this.health) {
      // NOTE: We determine direction before we draw
      // TODO: This is buggy when the player walks into a prop, coming
      //       from the right
      if (this.vx > 0) {
        this.currentAsset = this.assets.playerRunRight;
      } else if (this.vx < 0) {
        this.currentAsset = this.assets.playerRunLeft;
      } else if (this.vx === 0 && prevVx > 0) {
        this.currentAsset = this.assets.playerIdleRight;
      } else if (this.vx === 0 && prevVx < 0) {
        this.currentAsset = this.assets.playerIdleLeft;
      } else if (this.vx === 0 && prevVx === 0) {
        // noop, use currentAsset
      } else {
        this.currentAsset = this.assets[defaultAssetName];
      }

      prevVx = this.vx;

      window.globals.ctx.beginPath();
      window.globals.ctx.drawImage(
        this.currentAsset.sprite,
        this.currentAsset.sWidth * this.currentTick,
        0,
        this.currentAsset.sWidth,
        this.currentAsset.sHeight,
        window.globals.canvas.width / 2 - this.w / 2,
        this.y + this.currentAsset.dy,
        this.currentAsset.sWidth / 2,
        this.currentAsset.sHeight / 2
      );
      if (window.globals.debug.on) {
        const lineWidth = 1;
        window.globals.ctx.globalCompositeOperation = "source-over";
        window.globals.ctx.lineWidth = window.globals.debug.lineWidth;
        window.globals.ctx.strokeStyle = "#FF0000";
        window.globals.ctx.strokeRect(
          // NOTE: We divide the width of the screen and player here to center
          // the debug marker.
          window.globals.canvas.width / 2 - this.w / 2,
          this.y,
          this.w,
          this.h
        );
      }
      window.globals.ctx.closePath();
    }
  }
}
