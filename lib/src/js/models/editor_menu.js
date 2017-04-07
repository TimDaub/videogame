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
        this.padding = {
            right: 35,
            left: 35
        }

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
        let tiles = []
        let names = Object.keys(mapTiles)

        for (let i = 0; i < names.length; i++) {
            // By suming up all tile's width, we calcuate the ideal position of
            // the tile we'd like to render in this iteration.
            let offsetX = tiles.reduce((init, curr) => init + curr.sw, 0)

            // We then add the padding left and right to the tile's x offset.
            // NOTE: We let padding right's index is lagging by one to avoid
            // a double padding at the left side of the menu.
            offsetX += this.x+((i+1)*this.padding.right)+i*this.padding.left

            // NOTE: We do not use `this.padding`. Instead the tiles are simple
            // centered in the `EditorMenu`.
            const offsetY = this.y+(this.h-mapTiles[names[i]].sh)/2

            // Using the number of iterations, we calculate a padding per tile. 
            tiles.push(mapTileFactory(names[i], offsetX, offsetY))
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
