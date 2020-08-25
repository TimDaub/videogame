//@format
// NOTES: Asset property names are according to `drawImage` method with full
// parameters:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
// `void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth,
// dHeight);`
var assets = {
  background: { path: "images/background.png" },
  playerRunLeft: {
    path: "images/run_left.png",
    numOfFrames: 20,
    sx: 0,
    sWidth: 146,
    sHeight: 226,
    tickSpeed: 1,
    dy: 5
  },
  playerRunRight: {
    path: "images/run_right.png",
    numOfFrames: 20,
    sx: 0,
    sWidth: 146,
    sHeight: 226,
    tickSpeed: 1,
    dy: 5
  },
  playerIdleRight: {
    path: "images/idle_right.png",
    numOfFrames: 20,
    sx: 0,
    sWidth: 100,
    sHeight: 227,
    tickSpeed: 1,
    dy: 5
  },
  playerIdleLeft: {
    path: "images/idle_left.png",
    numOfFrames: 20,
    sx: 0,
    sWidth: 100,
    sHeight: 227,
    tickSpeed: 1,
    dy: 5
  },
  map: { path: "images/map.png" }
};

async function loadAssets() {
  const loadingAssets = [];
  Object.keys(assets).forEach(key => {
    var asset = assets[key];
    asset.sprite = new Image();
    asset.sprite.src = window.location.href + asset.path;
    loadingAssets.push(
      new Promise((resolve, reject) => (asset.sprite.onload = resolve))
    );
    assets[key] = asset;
  });

  // NOTE: Resolves only once all assets have successfully been loaded.
  await Promise.all(loadingAssets);
}

function getAsset(name) {
  return assets[name];
}

export { loadAssets, getAsset };
