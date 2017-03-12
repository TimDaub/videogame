import { assetsLoaded } from '../asset_manager.js'
import { mapTiles, mapTileFactory } from '../map_manager.js'


export default class EditorMenu {
    constructor(x, y, w, h, map, visible) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.map = map
        this.visible = visible
        this.tiles = this.loadTiles()
        this.pick = null

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
            this.map.addTile(this.pick)
            this.tiles = this.loadTiles()
            this.pick = null
        }

        document.onmousemove = (e) => {
            e = e || window.event;
            if(this.pick) {
                console.log(e.x, e.y)
                this.pick.x = e.x
                this.pick.y = e.y
            }
        }
    }

    loadTiles() {
        let padRight = 50
        let tiles = []
        let names = Object.keys(mapTiles)

        for (let i = 0; i < names.length; i++) {
            // By suming up all tiles width, we calcuate the ideal position of
            // the tile we'd like to render in this iteration..
            // TODO: When there are too many tiles, we'll have to implement a
            // scrolling or pagination function.
            let offsetX = tiles.reduce((init, curr) => init + curr.sw, 0)

            // Using the number of iterations, we calculate a padding per tile. 
            tiles.push(
                mapTileFactory(
                    names[i],
                    offsetX+this.x+padRight*i,
                    this.y
                )
            )
        }
        
        return tiles
    }

    update() {
        // TODO: Make menu scale with screen
        //       Call this method in main
    }

    render() {
        if (assetsLoaded() && this.visible) {
            window.globals.ctx.beginPath()
            window.globals.ctx.globalCompositeOperation = "source-over"
            window.globals.ctx.lineWidth = 2
            window.globals.ctx.strokeStyle="#000000"
            window.globals.ctx.strokeRect(this.x, this.y, this.w, this.h)
            window.globals.ctx.closePath()

            this.tiles.forEach((tile) => tile.render())
        }
    }
}
