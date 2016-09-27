import { getAsset,
         assetsLoaded,
         initializeAssets } from './asset_manager.js'

const main = () => {
    initializeAssets()
    var canvas, ctx, time
    var gravity = 9.81
    var ground = 550
    var ticks = 0
    var ticksPerFrame = 3
    var animation = 0
    var world = {
        screen: getScreenParams(),
        assets: {
            background: getAsset('background'),
        }
    }
    var player = {
        props: {
            w: 66,
            h: 61,
        },
        pos: {
            x: 100, // horizontal
            // NOTE: we set the initial position to ground
            // so that the player doesn't fall through it.
            y: ground, // vertical
        },
        former: {
            x: 0,
            y: 0,
            speed: {
                x: 0,
                y: 0,
            }
        },
        speed: {
            x: 0,
            y: 0,
        },
        assets: {
            walkright: getAsset('walkright'),
            walkleft: getAsset('walkleft'),
        },
        times: {
            jump: new Date().getTime(),
        },
    }

    function getScreenParams() {
        // Taken from: http://stackoverflow.com/a/28241682
        var width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth

        var height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight
        return {
            width,
            height,
        }
    }

    function init(currentTime) {
        canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        controls()
    }

    function controls() {
        document.onkeydown = function (e) {
            e = e || window.event;

            if(e.keyCode === 32) {
                jump(-60)
            }
            if(e.keyCode === 37) {
                walk(-8)
            }
            if(e.keyCode === 39) {
                walk(8)
            }
        }

        document.onkeyup = function(e) {
            e = e || window.event;
            if(e.keyCode === 37 || e.keyCode == 39) {
                walk(0)
            }
        }
    }

    function jump(speed) {
        if(player.pos.y >= ground) {
            player.times.jump = new Date().getTime()
            player.speed.y = speed
        }
    }

    function walk(speed) {
        player.former = {
            speed: {
                x: player.speed.x,
                y: player.speed.y,
            },
        }
        player.speed.x = speed
    }

    function renderPlayer() {
        if(assetsLoaded()) {
            var walkAsset
            if(player.speed.x > 0 || player.former.speed.x > 0) {
                walkAsset = player.assets.walkright
            } else {
                walkAsset = player.assets.walkleft
            }
            ctx.beginPath()
            ctx.drawImage(
                walkAsset.sprite,
                player.props.w*animation,
                0,
                player.props.w,
                player.props.h,
                player.pos.x,
                player.pos.y,
                player.props.w,
                player.props.h)
            ctx.closePath()
        }
    }

    function renderWorld() {
        if(assetsLoaded()) {
            ctx.beginPath()
            ctx.drawImage(
                world.assets.background.sprite,
                0,
                0,
                world.screen.width,
                world.screen.height)
            ctx.closePath()
        }
    }

    function updatePlayer() {
        var now = new Date().getTime()
        var jumpDelta = (now - player.times.jump)/500

        player.former.x = player.pos.x
        player.former.y = player.pos.y

        if(player.speed.x === 0) {
            ticksPerFrame = 1/0 // lol I'm such a haxor
        } else {
            ticksPerFrame = 3
        }
        player.pos.x += player.speed.x
        if(player.pos.y >= ground && player.speed.y > 0) {
            player.pos.y = ground
            time = now
        } else {
            player.speed.y = Math.floor(player.speed.y + gravity*jumpDelta)
            player.pos.y += Math.floor((player.speed.y * jumpDelta) + ((gravity/2) * Math.sqrt(jumpDelta, 2)))
            player.pos.y = Math.min(ground, player.pos.y)
        }
    }

    function updateWorld() {
        world.screen = getScreenParams()
        canvas.width = world.screen.width
        canvas.height = world.screen.height
    }

    function update() {
        ticks += 1
        if(ticks > ticksPerFrame) {
            ticks = 0
            animation += 1
            if(animation === 4) {
                animation = 0
            }
        }
        updatePlayer()
        updateWorld()
    }

    function render() {
        renderWorld()
        renderPlayer()
    }

    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
    };

    var now, dt,
        last = timestamp()

    function frame() {
        now   = timestamp()
        dt    = (now - last) / 1000
        update(dt)
        render(dt)
        last = now
        requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
    init()
}

document.addEventListener('DOMContentLoaded', main)
