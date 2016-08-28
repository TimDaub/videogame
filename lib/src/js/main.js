const main = () => {
    var canvas, ctx, time
    var gravity = 9.81
    var ground = 400
    var ticks = 0
    var ticksPerFrame = 3
    var animation = 0
    var player = {
        props: {
            w: 66,
            h: 61,
        },
        pos: {
            x: 100, // horizontal
            y: 400, // vertical
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
            walkright: {
                sprite: new Image(),
                loaded: false
            },
            walkleft: {
                sprite: new Image(),
                loaded: false
            },
        },
        times: {
            jump: new Date().getTime(),
        },
    }

    function init(currentTime) {
        canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        loadAssets()
        controls()
    }

    function isLoaded() {
        return Object.keys(player.assets).reduce(function(prev, assetName) {
            var asset = player.assets[assetName]
            return prev && asset.loaded
        }, true)
    }

    function loadAssets() {
        Object.keys(player.assets).forEach(function(assetName) {
            var asset = player.assets[assetName]
            asset.sprite.onload = function() {
                asset.loaded = true
            }
            asset.sprite.src = 'http://localhost:3000/images/' + assetName + '.png'
        })
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
        if(isLoaded()) {
            if(player.former) {
                ctx.clearRect(player.former.x, player.former.y, player.props.w, player.props.h)
            }
            var walkAsset
            if(player.speed.x > 0 || player.former.speed.x > 0) {
                walkAsset = player.assets.walkright.sprite
            } else {
                walkAsset = player.assets.walkleft.sprite
            }

            ctx.beginPath()
            ctx.drawImage(
                walkAsset,
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
        }
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
    }

    function render() {
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
