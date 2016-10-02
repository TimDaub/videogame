import { getAsset, assetsLoaded } from '../asset_manager.js'
import { getScreenParams } from '../utils.js'


export default class World {
    constructor(ctx, canvas, assetName) {
        this.ctx = ctx
        this.canvas = canvas
        this.screen = getScreenParams()
        this.asset = getAsset(assetName)
    }

    update() {
        this.screen = getScreenParams()
        this.canvas.width = this.screen.width
        this.canvas.height = this.screen.height
    }

    render() {
        if(assetsLoaded()) {
            this.ctx.beginPath()
            this.ctx.drawImage(
                this.asset.sprite,
                0,
                0,
                this.screen.width,
                this.screen.height)
            this.ctx.closePath()
        }
    }
}
