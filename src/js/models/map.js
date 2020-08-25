//@format
import { mapTileFactory } from "../map_manager.js";

export default class Map {
  constructor() {
    this.tiles = [];
    this.tiles.push(mapTileFactory("floatBig", 830, 500, 100, 83));
    this.tiles.push(mapTileFactory("floatBig", 930, 550, 100, 83));
    this.tiles.push(mapTileFactory("floatBig", 1050, 550, 100, 83));

    this.tiles.push(mapTileFactory("floatBig", 750, 600, 100, 83));

    this.tiles.push(mapTileFactory("floatBig", 550, 550, 100, 83));

    this.tiles.push(mapTileFactory("grasLeft", 200, 600));
    this.tiles.push(mapTileFactory("gras", 290, 600));
    this.tiles.push(mapTileFactory("gras", 336, 600));
    this.tiles.push(mapTileFactory("gras", 384, 600));
    this.tiles.push(mapTileFactory("gras", 432, 600));
  }

  addTile(tile) {
    tile.x += this.mapOffset();
    this.tiles.push(tile);
  }

  mapOffset() {
    // NOTE: Horizontal scrolling mechanism
    let screenOffset =
      window.globals.canvas.width / 2 - window.globals.player.w / 2;
    let playerX = window.globals.player.x;
    let mapOffset = playerX - screenOffset;

    return mapOffset;
  }

  render() {
    this.tiles.forEach(tile => tile.render(this.mapOffset()));
  }
}
