import { getAsset, assetsLoaded } from '../asset_manager.js'


export default class Player {
    constructor(w, h, x, y, vx, vy, respawn, assets) {
        this.spawnX = x
        this.spawnY = y
        this.respawn = respawn
        this.health = 100

        this.w = w
        this.h = h

        this.x = x
        this.y = y

        this.vx = vx
        this.vy = vy

        this.weight = 0.8

        this.ticks = 0
        this.ticksPerFrame = 3
        this.animation = 0

        assets.forEach((assetName) => {
            this[assetName] = getAsset(assetName)
        })
        this.walkAsset = this.walkright
        this.walkSpeed = 5

        this.initControls()
    }

    initControls() {
        // Walk intervals are used to continuously set the player's walking
        // speed, while an arrow key is pressed.
        let left = []
        let right = []
        let reset = (intervals) => {
            intervals.map(clearInterval)
            // We return an empty list to reset the given list of intervals
            return []
        }
        let walk = (speed) => {
            // We call this.walk here to have the player immediately react to
            // a key down event (and not with a delay of a few milliseconds
            this.walk(speed)
            return setInterval(() => this.walk(speed), 5)
        }

        document.onkeydown = (e) => {
            e = e || window.event;

            if(e.keyCode === 32) {
                this.jump(-14)
            }
            if(e.keyCode === 37 || e.keyCode === 65) {
                left.push(walk(-1*this.walkSpeed))
            }
            if(e.keyCode === 39 || e.keyCode === 68) {
                right.push(walk(this.walkSpeed))
            }
        }

        document.onkeyup = (e) => {
            e = e || window.event;
            // Once a key press in a certain direction was cleared, we
            // completely whipe all intervals and reset the list to empty.

            if(e.keyCode === 37 || e.keyCode === 65) {
                left = reset(left)
                this.walk(0)
            }
            if(e.keyCode === 39 || e.keyCode === 68) {
                right = reset(right)
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
        if(this.vy === 0) {
            this.vy = vy
        }
    }

    walk(vx) {
        this.vx = vx
    }

    update(dt) {
        // NOTE: collision to the right is not correct yet
        // NOTE 07.03: I don't know anymore what was meant by that :/
        this.updateAnimation()
        let tiles = window.globals.map.tiles

        // General idea for collisions:
        // Calculate the future x and y values, see if they collide with
        // anything (formerly, we did that at the beginning of this method and
        // had to correct afterwards - made the code super hard to change!), if
        // they collide, set position to exactly the colliding point and allow
        // movements away, but not towards the collision.

        // Gravity calculation, modified a bit for fun
        this.vy += (window.globals.gravity / this.weight) * Math.sqrt(dt, 2)

        // future position values
        let fx = this.x + this.vx
        let fy = this.y + this.vy

        tiles.forEach((tile) => {
            // Check if there is any collision
            let collisions = tile.collide(fx, fy, this.w, this.h)
            if (collisions) {
                // Retrieve the value that is closest to zero
                let side = Object
                    .keys(collisions)
                    // TODO: Comply with 80 char limit
                    .sort((a, b) => Math.abs(collisions[a]) > Math.abs(collisions[b]) ? 1 : -1)
                    .shift()

                // and depending on the outcome, set the players movement to
                // zero
                // TODO: Comply with 80 char limit
                let { left, right, bottom, top } = collisions
                if(side === 'bottom' && left > 30 && right > 30) {
                    // player standing on prop
                    this.y = tile.y-this.h    
                    this.vy = 0
                }
                if(side === 'top') {
                    // TODO: Currently disabled
                    //this.vy = 0 // player hitting its head
                }
                if(side === 'left') {
                    this.x = tile.x-this.w
                    this.vx = 0
                }
                if(side === 'right') this.vx = 0
            }
        })

        this.x += this.vx
        this.y += this.vy

        if (this.health <= 0 && this.respawn) {
            this.revive(100)
        }
        // NOTE: If player is out of screen's height, kill it.
        if (this.y >= window.globals.world.screen.height) {
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
            // NOTE: We determine direction before we draw
            // TODO: This is buggy when the player walks into a prop, coming
            //       from the right
            if(this.vx > 0) {
                this.walkAsset = this.walkright
            } else if(this.vx < 0) {
                this.walkAsset = this.walkleft
            }

            window.globals.ctx.beginPath()
            window.globals.ctx.drawImage(
                this.walkAsset.sprite,
                // +3 is just to correct manually a bit, maybe remove later
                this.w*this.animation,
                0,
                this.w,
                this.h,
                (window.globals.canvas.width/2)-(this.w/2),
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
