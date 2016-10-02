import { assetsLoaded } from '../asset_manager.js'


export default class MapTile {
    constructor(asset, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.asset = asset
        this.sx = sx
        this.sy = sy
        this.sw = sw
        this.sh = sh
        this.dx = dx
        this.dy = dy
        this.dw = dw
        this.dh = dh
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
                this.dx,
                this.dy,
                this.dw,
                this.dh)
            window.globals.ctx.closePath()
        }
    }
}
