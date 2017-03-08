import { assetsLoaded } from '../asset_manager.js'
import { mapTileFactory } from '../map_manager.js'


export default class Map {
    constructor() {
        this.tiles = []
        // Right
        this.tiles.push(mapTileFactory('floatBig', 830, 500, 100, 83))
        this.tiles.push(mapTileFactory('floatBig', 930, 550, 100, 83))
        this.tiles.push(mapTileFactory('floatBig', 1050, 550, 100, 83))
        // Under
        this.tiles.push(mapTileFactory('floatBig', 750, 600, 100, 83))
        // Above
        //this.tiles.push(mapTileFactory('floatBig', 700, 400, 100, 83))

        // Left
        //this.tiles.push(mapTileFactory('floatBig', 400, 400, 100, 83))

        // Under
        this.tiles.push(mapTileFactory('floatBig', 550, 550, 100, 83))

        this.tiles.push(mapTileFactory('grasLeft', 200, 600))
        this.tiles.push(mapTileFactory('gras', 288, 600))
        this.tiles.push(mapTileFactory('gras', 336, 600))
        this.tiles.push(mapTileFactory('gras', 384, 600))
        this.tiles.push(mapTileFactory('gras', 432, 600))
        //this.tiles.push(mapTileFactory('grasRight', 386, 600))
    }

    render() {
        if (assetsLoaded()) {
            // screen offset
            // player's x
            // mapoffset = player's x - screenoffset
            // for each tile do tile.x += mapoffset
            let screenOffset = (window.globals.canvas.width/2)-(window.globals.player.w/2)
            let playerX = window.globals.player.x
            let mapOffset = playerX - screenOffset

            this.tiles.forEach((tile) => tile.render(mapOffset))
        }
    }
}
