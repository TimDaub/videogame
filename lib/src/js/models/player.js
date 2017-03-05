import { getAsset, assetsLoaded } from '../asset_manager.js'


export default class Player {
    constructor(w, h, x, y, vx, vy, assets) {
        this.spawnX = x
        this.spawnY = y
        this.health = 100

        this.w = w
        this.h = h

        this.x = x
        this.y = y

        this.vx = vx
        this.vy = vy

        this.weight = 0.6

        // TODO: Remove all unnecessary ones (I think only vx is used)
        this.former = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
        }

        this.ticks = 0
        this.ticksPerFrame = 3
        this.animation = 0

        assets.forEach((assetName) => {
            this[assetName] = getAsset(assetName)
        })

        this.initControls()
    }

    initControls() {
        document.onkeydown = (e) => {
            e = e || window.event;

            if(e.keyCode === 32) {
                this.jump(-14)
            }
            if(e.keyCode === 37) {
                this.walk(-6)
            }
            if(e.keyCode === 39) {
                this.walk(6)
            }
        }

        document.onkeyup = (e) => {
            e = e || window.event;
            if(e.keyCode === 37 || e.keyCode === 39) {
                this.walk(0)
            }
        }
    }

    revive(health) {
        this.x = this.spawnX
        this.y = this.spawnY
        this.vx = 0
        this.vy = 0
        this.health = 100
    }

    jump(vy) {
        this.vy = vy
    }

    walk(vx) {
        // NOTE: This is for determining where the player walked last
        //       to draw its direction accordingly.
        this.former.vx = this.vx
        this.vx = vx
    }

    update(dt) {
        this.updateAnimation()
        let tiles = window.globals.map.tiles

        // Idea:
        // Calculate the future x and y values, see if they collide with
        // anything (formerly, we did that at the beginning of this method and
        // had to correct afterwards - made the code super hard to change!), if
        // they collide, set position to exactly the colliding point and allow
        // movements away, but not towards the collision.
        //
        // Local velocities
        let vx = this.vx
        let vy = this.vy + (window.globals.gravity / this.weight) * Math.sqrt(dt, 2)
        //let vy = 0
        // future position values
        let fx = this.x + vx
        let fy = this.y + vy

        tiles.forEach((tile) => {
            if (fy+this.h >= tile.y && tile.y+tile.h >= fy && fx+this.w >= tile.x && tile.x+tile.w >= fx) {
                let collisions = {
                    bottom: fy+this.h - tile.y,
                    top: tile.y+tile.h - fy,
                    left: fx+this.w - tile.x,
                    right: tile.x+tile.w - fx
                }

                let side = Object
                    .keys(collisions)
                    .sort((a,b) => Math.abs(collisions[a]) > Math.abs(collisions[b]) ? 1 : -1)
                    .shift()

                console.log(collisions['left'])

                if(side === 'bottom' || side === 'top') vy = 0
                if(side === 'right' || side === 'left') vx = 0

            }
        })
        this.x += vx
        this.y += vy

        this.vx = vx
        this.vy = vy

        if (this.y >= window.globals.world.screen.height) {
            // NOTE: If player is out of screen's height,
            //       kill it.
            this.health = 0
        }
    }

    updateAnimation() {
        this.ticks += 1
        if(this.ticks > this.ticksPerFrame) {
            this.ticks = 0
            this.animation += 1
            // TODO: Replace 4 with variable for animation end
            if(this.animation === 4) {
                this.animation = 0
            }
        }

        if(this.vx === 0) {
            this.ticksPerFrame = 1/0 // lol I'm such a haxor
        } else {
            this.ticksPerFrame = 3
        }
    }

    render() {
        if(assetsLoaded() && this.health) {
            var walkAsset

            // NOTE: We determine direction before we draw
            if(this.vx > 0 || this.former.vx > 0) {
                walkAsset = this.walkright
            } else {
                walkAsset = this.walkleft
            }

            window.globals.ctx.beginPath()
            window.globals.ctx.drawImage(
                walkAsset.sprite,
                this.w*this.animation,
                0,
                this.w,
                this.h,
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
