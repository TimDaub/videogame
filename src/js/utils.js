//@format
export function getScreenParams() {
  // Taken from: http://stackoverflow.com/a/28241682
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return {
    width,
    height
  };
}
