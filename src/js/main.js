//@format
import { loadAssets, getAsset } from "./asset_manager.js";
import { getScreenParams } from "./utils.js";

import Player from "./models/player.js";
import Map from "./models/map.js";
import Grid from "./models/grid.js";
import World from "./models/world.js";
import EditorMenu from "./models/editor_menu.js";
import "../sass/style.scss";

const main = async () => {
  window.globals = {
    canvas: null,
    ctx: null,
    ground: 550,
    gravity: 6,
    map: null,
    world: null,
    debug: {
      on: false,
      lineWidth: 1
    }
  };

  async function init(currentTime) {
    await loadAssets();
    window.globals.canvas = document.querySelector("canvas");
    window.globals.ctx = window.globals.canvas.getContext("2d");
    window.globals.map = new Map();
    // NOTE: We're setting the margin for the EditorMenu here!
    window.globals.editorMenu = new EditorMenu(
      50,
      50,
      window.globals.canvas.height - 50,
      50,
      window.globals.map,
      true
    );
    window.globals.world = new World(getAsset("background"));
    window.globals.player = new Player(73, 113, 430, 220, 0, 0, false, {
      playerRunLeft: getAsset("playerRunLeft"),
      playerRunRight: getAsset("playerRunRight"),
      playerIdleRight: getAsset("playerIdleRight"),
      playerIdleLeft: getAsset("playerIdleLeft")
    });
  }

  function update(dt) {
    let { width, height } = getScreenParams();
    window.globals.canvas.width = width;
    window.globals.canvas.height = height;

    window.globals.player.update(dt);
    window.globals.editorMenu.update();
  }

  function render() {
    window.globals.world.render();
    window.globals.editorMenu.render();
    window.globals.map.render();
    window.globals.player.render();
  }

  function timestamp() {
    if (window.performance && window.performance.now) {
      return window.performance.now();
    } else {
      return new Date().getTime();
    }
  }

  var now,
    dt,
    last = timestamp();

  function frame() {
    now = timestamp();
    dt = (now - last) / 1000;
    update(dt);
    render(dt);
    last = now;
    requestAnimationFrame(frame);
  }

  await init();
  requestAnimationFrame(frame);
};

document.addEventListener("DOMContentLoaded", main);
