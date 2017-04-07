import { getAsset,
         assetsLoaded,
         initializeAssets } from './asset_manager.js'
import { getScreenParams } from './utils.js'

import Player from './models/player.js'
import Map from './models/map.js'
import World from './models/world.js'
import EditorMenu from './models/editor_menu.js'


const main = () => {
    window.globals = {
        canvas: null,
        ctx: null,
        ground: 550,
        gravity: 6,
        map: null,
        world: null,
        // TODO: Debug mode doesn't work with horizontal scrolling
        debug: false,
    }

    function init(currentTime) {
        window.globals.canvas = document.querySelector('canvas')
        window.globals.ctx = window.globals.canvas.getContext('2d')
        window.globals.map = new Map()
        // NOTE: We're setting the margin for the EditorMenu here!
        window.globals.editorMenu = new EditorMenu(
            50,
            50,
            window.globals.canvas.height-50,
            50,
            window.globals.map,
            true
        )
        window.globals.world = new World('background')
        window.globals.player = new Player(67, 61, 430, 520, 0, 0,
                                           ['walkright', 'walkleft'])
    }

    function update(dt) {
        let { width, height} = getScreenParams()
        window.globals.canvas.width = width
        window.globals.canvas.height = height

        if (window.globals.player.health <= 0) {
            window.globals.player.revive(100)
        }
        window.globals.player.update(dt)
        window.globals.editorMenu.update()
    }

    function render() {
        window.globals.world.render()
        window.globals.map.render()
        window.globals.editorMenu.render()
        window.globals.player.render()
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
