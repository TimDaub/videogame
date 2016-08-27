const main = () => {
    var canvas, ctx, time
    var time = new Date().getTime()
    var gravity = 9.81
    var ground = 400
    var input = false
    var player = {
        props: {
            w: 100,
            h: 100,
        },
        pos: {
            x: 100, // horizontal
            y: 400, // vertical
        },
        speed: {
            x: 0,
            y: 0,
        },
    }

    function init(currentTime) {
        canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        controls()
    }

    function controls() {
        document.onkeypress = function (e) {
            e = e || window.event;
            if(e.keyCode == 32) {
                jump(15, -35) 
            }
        };
    }

    function jump(speedX, speedY) {
        time = new Date().getTime()
        player.speed = {
            x: speedX,
            y: speedY,
        }
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
        var delta = (now - time)/500
        player.former = {
            x: player.pos.x,
            y: player.pos.y
        }
        if(player.pos.y >= ground && player.speed.y > 0) {
            player.pos.y = ground
            time = now
        } else {
            player.pos.x += Math.floor(player.speed.x * delta)
            player.speed.y = Math.floor(player.speed.y + gravity*delta)
            player.pos.y += Math.floor((player.speed.y * delta) + ((delta/2) * Math.sqrt(delta, 2)))
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
