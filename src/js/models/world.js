//@format
import { getAsset, assetsLoaded } from '../asset_manager.js'
import { getScreenParams } from '../utils.js'


export default class World {
    constructor(assetName) {
        this.screen = getScreenParams()
        this.asset = getAsset(assetName)
    }

    render() {
        if(assetsLoaded()) {
            window.globals.ctx.beginPath()
            window.globals.ctx.drawImage(
                this.asset.sprite,
                0,
                0,
                window.globals.canvas.width,
                window.globals.canvas.height)
            window.globals.ctx.closePath()
        }
    }
}
