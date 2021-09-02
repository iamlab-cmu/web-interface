/**
 * Setup all visualization elements when the page is loaded. 
 */
function init() {
  let host_name = document.currentScript.getAttribute('host_name');
  let topic_name = document.currentScript.getAttribute('topic_name');
  let canvas_name = document.currentScript.getAttribute('canvas_name');
  let canvas = document.getElementById(canvas_name);
  let rect = canvas.getBoundingClientRect();
  let width = rect.width;
  let height = width / 4 * 3;
  

  // Create the main viewer.
  var viewer = new MJPEGCANVAS.Viewer({
    canvasID : canvas_name,
    host : host_name,
    width : width,
    height : height,
    topic : topic_name,
    interval : 200
  });
}

init();