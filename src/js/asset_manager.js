//@format
var assetsFolder = window.location.href + "images/";
var assets = {};
var files = [
  "background.png",
  "run_left.png",
  "run_right.png",
  "idle.png",
  "map.png"
];

export function assetsLoaded() {
  return Object.keys(assets).reduce(function(prev, name) {
    return prev && assets[name].loaded;
  }, true);
}

export function getAsset(name) {
  var asset = assets[name];
  return asset;
}

export function initializeAssets() {
  files.forEach(function(fileName) {
    var sanitizedName = fileName.split(".")[0];
    assets[sanitizedName] = {
      sprite: new Image(),
      loaded: false,
      file: fileName
    };
  });
  loadAssets();
}

function loadAsset(asset) {
  asset.sprite.src = assetsFolder + asset.file;
  asset.sprite.onload = function() {
    asset.loaded = true;
  };
  return asset;
}

export function loadAssets() {
  Object.keys(assets).forEach(function(spriteName) {
    loadAsset(assets[spriteName]);
  });
}
