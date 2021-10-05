/**
 * Setup all visualization elements when the page is loaded. 
 */
function init() {
  let host_name = document.currentScript.getAttribute('host_name');
  var xhr = new XMLHttpRequest()  
  xhr.responseType = 'blob';  
  xhr.open('GET', "http://"+host_name+":5006/bokeh_server/autoload.js?bokeh-autoload-element=1039&bokeh-app-path=/bokeh_server&bokeh-absolute-url=http://"+host_name+":5006/bokeh_server", true);
  xhr.onload = function (event) {
    var script = document.createElement('script'),
    src = URL.createObjectURL(event.target.response);
    script.src = src;
    let visual_container = document.getElementById('visuals_container');
    visual_container.appendChild(script);
  };
  xhr.send();
}

init();