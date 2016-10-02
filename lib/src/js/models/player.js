import { getAsset, assetsLoaded } from '../asset_manager.js'


export default class Player {
    constructor(w, h, x, y, vx, vy, assets) {
        this.w = w
        this.h = h

        this.x = x
        this.y = y

        this.vx = vx
        this.vy = vy

        this.jumpTime = new Date().getTime()
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
                this.jump(-60)
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
            if(e.keyCode === 37 || e.keyCode == 39) {
                this.walk(0)
            }
        }
    }

    jump(vy) {
        let tile = window.globals.map.findCollision(this.x, this.y, this.w,
                                                    this.h)
        if (tile) {
            this.jumpTime = new Date().getTime()
            this.vy = vy
        }
    }

    walk(vx) {
        this.former.vx = this.vx
        this.former.vy = this.vy
        this.vx = vx
    }

    update() {
        this.updateAnimation()

        var now = new Date().getTime()
        var jumpDelta = (now - this.jumpTime)/500

        this.former.x = this.x
        this.former.y = this.y

        this.x += this.vx

        let tile = window.globals.map.findCollision(this.x, this.y, this.w,
                                                    this.h)

        if (tile && this.vy >= 0) {
            this.y = tile.y - this.h
            this.vy = 0
        } else {
            this.vy = Math.floor(this.vy + window.globals.gravity*jumpDelta)
            // TODO: Comply to 80 chars minimum per line
            this.y += Math.floor((this.vy * jumpDelta) + ((window.globals.gravity/2) * Math.sqrt(jumpDelta, 2)))
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
        if(assetsLoaded()) {
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
            window.globals.ctx.closePath()
        }
    }
}
