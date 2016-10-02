import { getAsset,
         assetsLoaded,
         initializeAssets } from './asset_manager.js'

import Player from './models/player.js'
import World from './models/world.js'


const main = () => {
    initializeAssets()

    var canvas, ctx, time, world, player
    var gravity = 9.81
    var ground = 550

    function init(currentTime) {
        canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        world = new World(ctx, canvas, 'background')
        player = new Player(ctx, 66, 61, 100, ground, 0, 0,
                            ['walkright', 'walkleft'])
        controls()
    }

    function controls() {
        document.onkeydown = function (e) {
            e = e || window.event;

            if(e.keyCode === 32) {
                player.jump(ground, -60)
            }
            if(e.keyCode === 37) {
                player.walk(-8)
            }
            if(e.keyCode === 39) {
                player.walk(8)
            }
        }

        document.onkeyup = function(e) {
            e = e || window.event;
            if(e.keyCode === 37 || e.keyCode == 39) {
                player.walk(0)
            }
        }
    }

    function update() {
        player.update(ground, gravity, time)
        world.update()
    }

    function render() {
        world.render()
        player.render()
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
