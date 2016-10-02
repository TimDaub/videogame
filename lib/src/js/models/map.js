import { assetsLoaded } from '../asset_manager.js'
import { mapTileFactory } from '../map_manager.js'


export default class Map {
    constructor() {
        this.mapTiles = []
        this.mapTiles.push(mapTileFactory('floatBig', 500, 500, 100, 100))
    }

    render() {
        if (assetsLoaded()) {
            this.mapTiles.forEach((tile) => tile.render())
        }
    }
}
