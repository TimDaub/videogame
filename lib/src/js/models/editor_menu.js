import { assetsLoaded } from '../asset_manager.js'
import { mapTiles, mapTileFactory } from '../map_manager.js'


export default class EditorMenu {
    constructor(mt, mr, mb, ml, map, visible) {
        this.mt = mt
        this.mr = mr
        this.mb = mb
        this.ml = ml
        this.x = this.y = this.w = this.h = 0
        this.map = map
        this.visible = visible
        this.pick = null
        this.tiles = null

        this.initControls()
    }

    initControls() {
        document.onmousedown = (e) => {
            e = e || window.event;

            this.tiles.forEach((tile) => {
                if (tile.collide(e.x, e.y, 0, 0)) {
                    this.pick = tile
                }
            })
        }

        document.onmouseup = (e) => {
            if (this.pick) {
                this.map.addTile(this.pick)
                this.tiles = this.loadTiles()
                this.pick = null
            }
        }

        document.onmousemove = (e) => {
            e = e || window.event;
            if(this.pick) {
                this.pick.x = e.x
                this.pick.y = e.y
            }
        }
    }

    loadTiles() {
        // TODO: When there are too many tiles, we'll have to implement a
        // scrolling or pagination function.
        // TODO: Move this variable higher up
        let padRight = 50
        let tiles = []
        let names = Object.keys(mapTiles)

        for (let i = 0; i < names.length; i++) {
            // By suming up all tile's width, we calcuate the ideal position of
            // the tile we'd like to render in this iteration.
            let offsetX = tiles.reduce((init, curr) => init + curr.sw, 0)

            // Using the number of iterations, we calculate a padding per tile. 
            tiles.push(
                mapTileFactory(names[i], offsetX+this.x+padRight*i, this.y)
            )
        }
        
        return tiles
    }

    update() {
        this.x = this.ml
        this.y = this.mt
        this.w = window.globals.canvas.width-this.mr-this.ml
        this.h = window.globals.canvas.height-this.mb-this.mt
        this.tiles = this.loadTiles()
    }

    render() {
        if (assetsLoaded() && this.visible) {
            window.globals.ctx.beginPath()
            window.globals.ctx.globalCompositeOperation = "source-over"
            window.globals.ctx.lineWidth = 2
            window.globals.ctx.strokeStyle = "#000000"
            window.globals.ctx.strokeRect(this.x, this.y, this.w, this.h)
            window.globals.ctx.closePath()

            if (this.pick) {
                this.pick.render()
            }
            this.tiles.forEach((tile) => tile.render())
        }
    }
}
