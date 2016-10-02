import { assetsLoaded } from '../asset_manager.js'
import { mapTileFactory } from '../map_manager.js'


export default class Map {
    constructor() {
        this.tiles = []
        this.tiles.push(mapTileFactory('floatBig', 500, 500, 100, 83))
        this.tiles.push(mapTileFactory('floatBig', 300, 600, 100, 83))
    }

    findCollision(objX, objY, objW, objH) {
        let collidingTile = null
        for (let tile of this.tiles) {
            // NOTE: The racoon is way fatter than its actual physical model
            //       hence we devide it's width by two here.
            let horizontal = objX + objW/2 >= tile.x && objX <= tile.x + tile.w
            let vertical = objY + objH >= tile.y
            if (horizontal && vertical) {
                collidingTile = tile
                break
            }
        }

        return collidingTile
    }

    render() {
        if (assetsLoaded()) {
            this.tiles.forEach((tile) => tile.render())
        }
    }
}
