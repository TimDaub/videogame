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
        gravity: 6,
        map: null,
        world: null,
        debug: true,
    }
    var world, player

    function init(currentTime) {
        window.globals.canvas = document.querySelector('canvas')
        window.globals.ctx = window.globals.canvas.getContext('2d')
        window.globals.map = new Map()
        window.globals.world = new World('background')
        player = new Player(71, 61, 730, 539, 0, 0,
                            ['walkright', 'walkleft'])
    }

    function update(dt) {
        if (player.health <= 0) {
            player.revive(100)
        }
        player.update(dt)
        window.globals.world.update()
    }

    function render() {
        window.globals.world.render()
        window.globals.map.render()
        player.render()
    }

    function timestamp() {
        if (window.performance && window.performance.now) {
            return window.performance.now()
        } else {
            return new Date().getTime()
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
