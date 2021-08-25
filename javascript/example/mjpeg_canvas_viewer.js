
let canvas;

init();
/**
 * Setup all visualization elements when the page is loaded. 
 */
function init() {
  canvas = document.getElementById("camera_canvas");
  let rect = canvas.getBoundingClientRect();
  let width = rect.width;
  let height = width / 4 * 3;

  // Create the main viewer.
  var viewer = new MJPEGCANVAS.Viewer({
    canvasID : 'camera_canvas',
    host : '192.168.3.201',
    width : width,
    height : height,
    topic : '/camera/color/image_raw',
    interval : 200
  });
}