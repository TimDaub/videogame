import { getAsset,
         assetsLoaded,
         initializeAssets } from './asset_manager.js'

import Player from './models/player.js'
import World from './models/world.js'


const main = () => {
    initializeAssets()

    window.globals = {
        ground: 550,
        gravity: 9.81,
    }
    var canvas, ctx, world, player

    function init(currentTime) {
        canvas = document.querySelector('canvas')
        ctx = canvas.getContext('2d')
        world = new World(ctx, canvas, 'background')
        player = new Player(ctx, 66, 61, 100, window.globals.ground, 0, 0,
                            ['walkright', 'walkleft'])
    }

    function update() {
        player.update()
        world.update()
    }

    function render() {
        world.render()
        player.render()
    }

    function timestamp() {
        if (window.performance && window.performance.now) {
            window.performance.now()
        } else {
            new Date().getTime()
        }
    }

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
