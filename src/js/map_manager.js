//@format
import { getAsset } from './asset_manager.js'
import MapTile from './models/map_tile.js'


export const mapTiles = {
    floatBig: {
        sx: 40,
        sy: 27,
        sw: 100,
        sh: 75,
        blocking: true,
    },
    grasLeft: {
        sx: 35,
        sy: 185,
        sw: 90,
        sh: 100,
        blocking: true,
    },
    grasRight: {
        sx: 515,
        sy: 185,
        sw: 40,
        sh: 87,
        blocking: true,
    },
    gras: {
        sx: 190,
        sy: 185,
        sw: 50,
        sh: 40,
        blocking: true,
    },
    tree: {
        sx: 190,
        sy: 47,
        sw: 125,
        sh: 116,
        blocking: false,
    }
}

export function mapTileFactory(tileName, dx, dy, dw, dh) {
    var tile = mapTiles[tileName]
    var asset = getAsset('map')
    return new MapTile(asset, tile.sx, tile.sy, tile.sw, tile.sh, dx, dy,
                       dw || tile.sw, dh || tile.sh, tile.blocking)
}
