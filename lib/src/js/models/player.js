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

        this.jumpTime = new Date().getTime()
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
                this.jump(-30)
            }
            if(e.keyCode === 37) {
                this.walk(-8)
            }
            if(e.keyCode === 39) {
                this.walk(8)
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
        this.jumpTime = new Date().getTime()
        this.vy = vy
    }

    walk(vx) {
        // NOTE: This is for determining where the player walked last
        //       to draw its direction accordingly.
        this.former.vx = this.vx
        this.vx = vx
    }

    update() {
        this.updateAnimation()

        var now = new Date().getTime()
        // TODO: Jumpdelta gets crazy big when player walks of a cliff.
        //       We should track when a player steps of a cliff.
        var jumpDelta = (now - this.jumpTime)/1000

        let tiles = window.globals.map.tiles
        let sideCollision = null
        let topBottomCollision = null

        tiles.forEach((tile) => {
            if (this.y+this.h > tile.y && this.y < tile.y+tile.h) {
                if (this.x+this.w >= tile.x && this.x <= tile.x+tile.w) {
                    sideCollision = tile
                }
            }
            if (this.x+this.w > tile.x && this.x < tile.x+tile.w) {
                if (this.y+this.h >= tile.y && this.y <= tile.y+tile.h) {
                    topBottomCollision = tile
                }
            }
        })

        let vx = 0
        let vy = 0
        let dx = 0
        let dy = 0

        if (sideCollision) {
            if (this.x-this.w < sideCollision.x) {
                dx = sideCollision.x - this.x-this.w
                if (dx === 0 && this.vx < 0) {
                    dx = this.vx
                }
            } else {
                dx = Math.abs(this.x - sideCollision.x-sideCollision.w)
                if (dx === 0 && this.vx > 0) {
                    dx = this.vx
                }
            }
            vx = dx
        } else {
            vx = this.vx
        }

        if(topBottomCollision) {
            if (this.y-this.h < topBottomCollision.y) {
                dy = topBottomCollision.y - this.y-this.h
                if(dy === 0 && this.vy < 0) {
                    dy = this.vy
                }
            } else {
                // Case: Player hits its head
                // We want the player to fall according to gravity
                dy = Math.abs(this.y - topBottomCollision.y-topBottomCollision.h)
                // If the player is in a jump and collides with its head with
                // a object, we want to reverse the speed into the other
                // direction
                this.vy *= -1
                if(dy === 0 && this.vy > 0) {
                    dy = this.vy
                }
            }
            vy = dy
        } else {
            // Gravity calculations for a player that is falling
            this.vy = Math.floor(this.vy + window.globals.gravity*jumpDelta)
            vy = Math.floor((this.vy * jumpDelta) + ((window.globals.gravity/2) * Math.sqrt(jumpDelta, 2)))
        }

        // Sometimes a player has collitions on two sides. If so, one of the
        // sides is incorrect. We can savely assume that the lower distance is
        // the correct collision.
        //
        // TODO: Figure out why we use dx and dy independently here. Seems like
        //       bullshit.
        //
        if (Math.abs(dx) > Math.abs(dy) && dy !== 0) {
            this.y += vy
            this.x += this.vx
        } else if (Math.abs(dx) < Math.abs(dy)) {
            this.y += this.vy
            this.x += vx
        } else {
            this.x += vx
            this.y += vy
        }

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
