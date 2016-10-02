import { getAsset, assetsLoaded } from '../asset_manager.js'
import { getScreenParams } from '../utils.js'


export default class World {
    constructor(assetName) {
        this.screen = getScreenParams()
        this.asset = getAsset(assetName)
    }

    update() {
        this.screen = getScreenParams()
        window.globals.canvas.width = this.screen.width
        window.globals.canvas.height = this.screen.height
    }

    render() {
        if(assetsLoaded()) {
            window.globals.ctx.beginPath()
            window.globals.ctx.drawImage(
                this.asset.sprite,
                0,
                0,
                this.screen.width,
                this.screen.height)
            window.globals.ctx.closePath()
        }
    }
}
