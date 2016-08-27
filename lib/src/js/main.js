const main = () => {
    var canvas, ctx, time
    var gravity = 9.81
    var ground = 400
    var ticks = 500
    var player = {
        props: {
            w: 50,
            h: 50,
        },
        pos: {
            x: 100, // horizontal
            y: 400, // vertical
        },
        speed: {
            x: 0,
            y: 0,
        },
        times: {
            jump: new Date().getTime(),
        },
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
                walk(-12)
            }
            if(e.keyCode === 39) {
                walk(12)
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
        player.speed.x = speed
    }

    function renderPlayer() {
        if(player.former) {
            ctx.clearRect(player.former.x, player.former.y, player.props.w, player.props.h)
        }
        ctx.beginPath()
        ctx.rect(player.pos.x, player.pos.y, player.props.w, player.props.h)
        ctx.fill()
        ctx.closePath()
    }

    function updatePlayer() {
        var now = new Date().getTime()
        var jumpDelta = (now - player.times.jump)/ticks

        player.former = {
            x: player.pos.x,
            y: player.pos.y
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
