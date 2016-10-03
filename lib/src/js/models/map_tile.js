import { assetsLoaded } from '../asset_manager.js'


export default class MapTile {
    constructor(asset, sx, sy, sw, sh, x, y, w, h) {
        this.asset = asset
        this.sx = sx
        this.sy = sy
        this.sw = sw
        this.sh = sh
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    render() {
        if(assetsLoaded()) {
            window.globals.ctx.beginPath()
            // NOTE: If this is to heavy for you, read the docs:
            // https://developer.mozilla.org/de/docs/Web/API/
            // CanvasRenderingContext2D/drawImage
            window.globals.ctx.drawImage(
                this.asset.sprite,
                this.sx,
                this.sy,
                this.sw,
                this.sh,
                this.x,
                this.y,
                this.w,
                this.h)
            if (window.globals.debug) {
                window.globals.ctx.globalCompositeOperation = "source-over"
                window.globals.ctx.lineWidth = 2
                window.globals.ctx.strokeStyle="#FF0000"
                window.globals.ctx.strokeRect(this.x, this.y, this.w, this.h)
            }
            window.globals.ctx.closePath()
        }
    }
}
