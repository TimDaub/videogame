import { assetsLoaded } from '../asset_manager.js'
import { mapTileFactory } from '../map_manager.js'


export default class Map {
    constructor() {
        this.tiles = []
        // Left
        //this.tiles.push(mapTileFactory('floatBig', 600, 500, 100, 83))
        // Right
        //this.tiles.push(mapTileFactory('floatBig', 800, 500, 100, 83))

        // Under
        this.tiles.push(mapTileFactory('floatBig', 700, 600, 100, 83))
        // Above
        //this.tiles.push(mapTileFactory('floatBig', 700, 400, 100, 83))
    }

    render() {
        if (assetsLoaded()) {
            this.tiles.forEach((tile) => tile.render())
        }
    }
}
