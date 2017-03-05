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

    // Can be removed
    calcSideCollision(fx, tile) {
        let dx
        if (fx-this.w < tile.x) {
            //console.log('rechts')
            dx = tile.x - fx-this.w
            if (dx === 0 && this.vx < 0) {
                dx = this.vx
            }
        } else {
            //console.log('links')
            dx = Math.abs(fx - tile.x-tile.w)
            if (dx === 0 && this.vx > 0) {
                dx = this.vx
            }
        }
        return dx
    }

    // Can be removed
    calcTopBottomCollision(fy, tile) {
        let dy
        if (this.y-this.h < tile.y) {
            dy = tile.y - this.y-this.h
            //console.log(this.y, this.h, tile.y)
            if(dy === 0 && this.vy < 0) {
                dy = this.vy
            }
        } else {
            // Case: Player hits its head
            // We want the player to fall according to gravity
            dy = Math.abs(this.y - tile.y-tile.h)
            // If the player is in a jump and collides with its head with
            // a object, we want to reverse the speed into the other
            // direction
            this.vy *= -1
            if(dy === 0 && this.vy > 0) {
                dy = this.vy
            }
        }
        return dy
    }

    update(dt) {
        this.updateAnimation()
        let tiles = window.globals.map.tiles
        let sideCollision = null
        let topBottomCollision = null

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

        // collision distances 
        let dx = null
        let dy = null

        tiles.forEach((tile) => {
            // NOTE: Those conditions are basically the same.
            //       Something smells here
            // fy+this.h > tile.y if figure y +height greater than tile y on top ==> standing on ground
            //fy <= tile.y+tile.h if figure y smaller than tile y on top and tile height ==> ???
            //                    tile y + height is greater than figure y ==> head in tile
            //console.log(bottom, top, left, right)

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
            // if (fy+this.h > tile.y && tile.y+tile.h > fy) {
            //     if (fx+this.w >= tile.x && fx < tile.x+tile.w) {
            //         dx = this.calcSideCollision(fx, tile)
            //         dy = this.calcTopBottomCollision(fy, tile)
            //         //console.log('side')
            //     }
            // }
        })
        this.x += vx
        this.y += vy

        this.vx = vx
        this.vy = vy
        // If one of the collisions is defined, we have a problem
        // Lets try to correct now already

        // Sometimes a player has collisions on two sides. If so, one of the
        // sides is incorrect. We can savely assume that the lower distance is
        // the correct collision.
        //
        //console.log(dy, dx)
        // if(dx !== null && dy !== null && dx !== 0 && dy !== 0) {
        //     if (Math.abs(dx) > Math.abs(dy)) {
        //         //console.log('vert')
        //         vy = 0
        //     } else {
        //         //console.log('hort')
        //         vx = 0
        //         //vx += dx
        //     }
        // // lol ja ne
        // } else if (dx === 0 && dy == 0) {
        //     console.log('double')
        //     vy = 0
        // }


        // } else if (Math.abs(dx) > Math.abs(dy)) {
        //     console.log('vert')
        //     this.y += dy
        //     this.x += vx

        //     this.vy = 0
        // } else {
        //     console.log('hor ', dx)
        //     this.x += dx
        //     this.y += this.vy

        //     this.vx = vx
        // }

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
