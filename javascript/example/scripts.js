let host_name = "iam-thor.ri.cmu.edu"
let ros_url = 'ws://'+host_name+':9090'

var ros = new ROSLIB.Ros({
            url : ros_url
          });
ros.on('connection', function() {document.getElementById("status").innerHTML = "Connected";});

ros.on('error', function(error) {document.getElementById("status").innerHTML = "Error";});

ros.on('close', function() {document.getElementById("status").innerHTML = "Closed";});


var display_msg_listener = new ROSLIB.Topic({ros : ros,name : "/human_interface_request", messageType : 'web_interface_msgs/Request'});
display_msg_listener.subscribe(function(data) {
            console.log(data);
            parse_data(data);});

var state_server_publisher = new ROSLIB.Topic({ros : ros,name : "/human_interface_reply", messageType : 'web_interface_msgs/Reply'});

var domain_handler_publisher = new ROSLIB.Topic({ros : ros,name : "/human_interface_confirmation", messageType : 'web_interface_msgs/Confirmation'});

let viz_data;
let sliders = [];
let text_inputs = [];
let current_display_type = 0;
let default_camera_topic_name = "/rgb/image_raw";

function button_click(i){
  buttons_data  = viz_data.buttons.slice();
  sliders_data = viz_data.sliders.slice()
  text_data = viz_data.text_inputs.slice()

  for(let j = 0; j < sliders_data.length; j++){
    curr_slider = document.getElementById(sliders[j]);
    sliders_data[j].value = parseInt(curr_slider.value);
  }

  for(let k = 0; k < text_data.length; k++){
    curr_text = document.getElementById(text_inputs[k]);
    text_data[k].value = curr_text.value;
  }

  buttons_data[i].value = true;

  var return_msg = new ROSLIB.Message({
      buttons: buttons_data,
      sliders: sliders_data,
      text_inputs: text_data,
      Bbox: viz_data.boxes
    });

  state_server_publisher.publish(return_msg);
  state_server_publisher.publish(return_msg);

  if (viz_data.display_type == 0){
    clear_screen(clear_visuals=false);
  }
  else{
    clear_screen();
    display_default_screen();
  }
}

function generate_text(text_array){
  var inputs_container = document.getElementById('inputs_container');
  text_div = document.createElement('div');
  text_div.id = "text_div";
  text_div.className = "col-sm-12";
  inputs_container.appendChild(text_div)
  text_container = document.createElement('form');
  text_container.id = "text_container";
  text_div.appendChild(text_container)

  for(let i = 0; i < text_array.length; i++){
    var form_group = document.createElement('div');
    form_group.className = 'form-group row';

    var label = document.createElement('label');
    label.innerHTML = text_array[i].text;
    label.className = "col-sm-2 col-form-label";
    label.setAttribute('for', text_array[i].name);

    var text_div = document.createElement('div');
    text_div.className = "col-sm-10";

    var text_input = document.createElement('input');
    text_input.className = "form-control";
    text_input.type = "text";
    text_input.id = text_array[i].name;
    text_input.setAttribute('placeholder',text_array[i].value);
    text_div.appendChild(text_input);

    form_group.appendChild(label);
    form_group.appendChild(text_div);
    
    text_container.appendChild(form_group);
    text_inputs.push(text_array[i].name);
  }
}


function generate_buttons(buttons_array){
  var inputs_container = document.getElementById('inputs_container');
  button_container = document.createElement('div');
  button_container.id = "button_container";
  button_container.className = "col-sm-12 text-center";
  inputs_container.appendChild(button_container)

  for(let i = 0; i < buttons_array.length; i++){
    var button = document.createElement('input');
    button.type = 'button';
    button.id = buttons_array[i].text;
    button.value = buttons_array[i].name;
    button.className = 'btn btn-outline-secondary mr-2';
    button.onclick = function() {button_click(i);};
    button_container.appendChild(button);
  }
}

function generate_slider(name,text,min,max){
  var slider_container = document.createElement('div');
  var description = document.createElement('p');
  description.innerHTML = text;
  var slider_val = document.createElement('p');
  slider_val.innerHTML = "Value:" + min;
  var slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.id = name;
  slider.value = min;
  slider.oninput = function() {slider_val.innerHTML = "Value:" + this.value;}; 
 
  slider_container.appendChild(description);
  slider_container.appendChild(slider);
  slider_container.appendChild(slider_val);

  var container = document.getElementById('slider_container');
  container.appendChild(slider_container);
}

function generate_sliders(sliders_array){
  var inputs_container = document.getElementById('inputs_container');
  slider_container = document.createElement('div');
  slider_container.id = "slider_container";
  slider_container.className = "col-sm-12";
  inputs_container.appendChild(slider_container)

  for(let i = 0; i < sliders_array.length; i++){
    generate_slider(sliders_array[i].name,sliders_array[i].text,sliders_array[i].min.toString(),sliders_array[i].max.toString());
    sliders.push(sliders_array[i].name);
  }
}

function parse_data(data){
  viz_data = data;
  console.log(data)
  if (data.display_type == 0){
    if (current_display_type == 0) {
      clear_screen(clear_visuals=false);
    }
    else {
      clear_screen();
      display_default_screen();
    }
    current_display_type = 0;
    document.getElementById("msg").innerHTML = viz_data.instruction_text;
    generate_text(viz_data.text_inputs);
    generate_sliders(viz_data.sliders);
    generate_buttons(viz_data.buttons);
    return;
  }
  if (data.display_type == 1){
    if (current_display_type == 1) {
      clear_screen(clear_visuals=false);
    }
    else {
      clear_screen();
    }
    current_display_type = 1;
    document.getElementById("msg").innerHTML = viz_data.instruction_text;
    generate_text(viz_data.text_inputs);
    generate_sliders(viz_data.sliders);
    generate_buttons(viz_data.buttons);
    var robot_1_div = add_robot("robot_1",traj=true);
    var robot_2_div = add_robot("robot_2",traj=true);
    var container = document.getElementById('visuals_container');
    container.appendChild(robot_1_div);
    container.appendChild(robot_2_div);
  }
  if (data.display_type == 2){
    if (current_display_type == 2) {
      clear_screen(clear_visuals=false);
    }
    else {
      clear_screen();
    }
    current_display_type = 2;
    document.getElementById("msg").innerHTML = viz_data.instruction_text;
    generate_text(viz_data.text_inputs);
    generate_sliders(viz_data.sliders);
    generate_buttons(viz_data.buttons);
    var camera_div = add_camera(viz_data.camera_topic, half_size=true);
    var robot_1_div = add_robot("robot_1", traj=true);
    var container = document.getElementById('visuals_container');
    container.appendChild(camera_div);
    container.appendChild(robot_1_div);
  }
  if (data.display_type == 3){
    if (current_display_type == 3) {
      clear_screen(clear_visuals=false);
    }
    else {
      clear_screen();
    }
    current_display_type = 3;
    load_bokeh_server();
  }
}

function add_robot(name,traj=false){

  robot_div = document.createElement('div');
  robot_div.id = name+"_div";
  robot_div.className = "col-sm-6";

  robot_viz = document.createElement('script'); 
  robot_viz.id = name;
  robot_viz.src = "./bundle/simple.js";
  robot_viz.setAttribute("ros_url", ros_url);

  if (traj) {robot_viz.setAttribute("traj",true)}
  else {robot_viz.setAttribute("traj",false)}

  robot_canvas = document.createElement('canvas');
  robot_canvas.id = name+"_canvas";
  robot_canvas.className = "robot_viz";

  robot_div.appendChild(robot_canvas);
  robot_div.appendChild(robot_viz);
  
  return robot_div;
}

function add_camera(topic_name, half_size){
  camera_div = document.createElement('div');
  camera_div.id = "camera_div";
  if (half_size) {camera_div.className = "col-sm-6"}
  else {camera_div.className = "col-sm-12"}

  camera_canvas = document.createElement('canvas');
  camera_canvas.id = "camera_canvas";
  camera_canvas.className = "camera_viz";

  camera_viz = document.createElement('script'); 
  camera_viz.id = "camera";
  camera_viz.src = "./mjpeg_canvas_viewer.js";
  camera_viz.setAttribute("topic_name", topic_name);
  camera_viz.setAttribute("host_name", host_name);
  camera_viz.setAttribute("canvas_name", "camera_canvas");

  camera_div.appendChild(camera_canvas);
  camera_div.appendChild(camera_viz);

  return camera_div;
}

function display_default_screen(){
  var camera_div = add_camera(default_camera_topic_name, half_size=true);
  var robot_div = add_robot("robot");
  var container = document.getElementById('visuals_container');
  container.appendChild(camera_div);
  container.appendChild(robot_div);
}

function load_bokeh_server(){
  var container = document.getElementById('visuals_container');
  bokeh_div = document.createElement('div');
  bokeh_div.id = "bokeh_div";
  bokeh_div.className = "col-sm-12"

  bokeh_viz = document.createElement('script'); 
  bokeh_viz.id = "1039";
  bokeh_viz.src = "./bokeh.js";
  bokeh_viz.setAttribute("host_name", host_name);
  
  bokeh_div.appendChild(bokeh_viz);
  
  container.appendChild(bokeh_div);
}

function clear_screen(clear_visuals=true){
  document.getElementById("msg").innerHTML = "";
  document.getElementById('inputs_container').innerHTML = "";
  sliders = [];
  text_inputs = [];
  if (clear_visuals) document.getElementById('visuals_container').innerHTML = "";
}

display_default_screen();
