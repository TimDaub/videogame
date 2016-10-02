import { getAsset,
         assetsLoaded,
         initializeAssets } from './asset_manager.js'

import Player from './models/player.js'
import Map from './models/map.js'
import World from './models/world.js'


const main = () => {
    window.globals = {
        canvas: null,
        ctx: null,
        ground: 550,
        gravity: 9.81,
    }
    var world, map, player

    function init(currentTime) {
        window.globals.canvas = document.querySelector('canvas')
        window.globals.ctx = window.globals.canvas.getContext('2d')
        world = new World('background')
        map = new Map()
        player = new Player(66, 61, 100, window.globals.ground, 0, 0,
                            ['walkright', 'walkleft'])
    }

    function update() {
        player.update()
        world.update()
    }

    function render() {
        world.render()
        map.render()
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

    initializeAssets()
    init()
}

document.addEventListener('DOMContentLoaded', main)
