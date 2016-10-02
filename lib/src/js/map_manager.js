import { getAsset } from './asset_manager.js'
import MapTile from './models/map_tile.js'


const mapTiles = {
    floatBig: {
        sx: 40,
        sy: 0,
        sw: 100,
        sh: 100,
    },
}

export function mapTileFactory(tileName, dx, dy, dw, dh) {
    var tile = mapTiles[tileName]
    var asset = getAsset('map')
    return new MapTile(asset, tile.sx, tile.sy, tile.sw, tile.sh, dx, dy, dw,
                       dh)
}
