// @format
export default class MapTile {
  constructor(asset, sx, sy, sw, sh, x, y, w, h, blocking) {
    this.asset = asset;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.blocking = blocking;
  }

  collide(x, y, w, h, ignoreBlocking) {
    if (
      (this.blocking || ignoreBlocking) &&
      y + h >= this.y &&
      this.y + this.h >= y &&
      x + w >= this.x &&
      this.x + this.w >= x
    ) {
      // If there is a collision, calculate for tile the distance in
      // every direction
      return {
        bottom: Math.floor(y + h - this.y),
        top: this.y + this.h - y,
        left: x + w - this.x,
        right: this.x + this.w - x
      };
    } else {
      return null;
    }
  }

  render(mapOffset) {
    if (!mapOffset) {
      // TODO: Generalize this, its super ugly
      mapOffset = 0;
    }
    window.globals.ctx.beginPath();
    // NOTE: If this is to heavy for you, read the docs:
    // https://developer.mozilla.org/de/docs/Web/API/
    // CanvasRenderingContext2D/drawImage
    window.globals.ctx.drawImage(
      this.asset.sprite,
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.x - mapOffset,
      this.y,
      this.w,
      this.h
    );
    if (window.globals.debug.on) {
      const lineWidth = 1;
      window.globals.ctx.globalCompositeOperation = "source-over";
      window.globals.ctx.lineWidth = window.globals.debug.lineWidth;
      window.globals.ctx.strokeStyle = "#FF0000";
      window.globals.ctx.strokeRect(this.x - mapOffset, this.y, this.w, this.h);
      window.globals.ctx.closePath();
    }
  }
}
