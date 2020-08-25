//@format
import { getScreenParams } from "../utils.js";

export default class World {
  constructor(asset) {
    this.screen = getScreenParams();
    this.asset = asset;
  }

  render() {
    window.globals.ctx.beginPath();
    window.globals.ctx.drawImage(
      this.asset.sprite,
      0,
      0,
      window.globals.canvas.width,
      window.globals.canvas.height
    );
    window.globals.ctx.closePath();
  }
}
