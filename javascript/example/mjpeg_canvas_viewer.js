
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

init();
/**
 * Setup all visualization elements when the page is loaded. 
 */
function init() {
  var width = (getWidth() / 2) - 100
  var height = width * 3 / 4

  // Create the main viewer.
  var viewer = new MJPEGCANVAS.Viewer({
    divID : 'mjpeg',
    host : 'localhost',
    width : width,
    height : height,
    topic : '/camera/color/image_raw',
    interval : 200
  });
}