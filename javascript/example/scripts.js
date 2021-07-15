var ros = new ROSLIB.Ros({
            url : 'ws://iam-wanda.ri.cmu.edu:9090'
          });
ros.on('connection', function() {document.getElementById("status").innerHTML = "Connected";});

ros.on('error', function(error) {document.getElementById("status").innerHTML = "Error";});

ros.on('close', function() {document.getElementById("status").innerHTML = "Closed";});


var display_msg_listener = new ROSLIB.Topic({ros : ros,name : "/human_interface_request",messageType : 'domain_handler_msgs/HumanInterfaceRequest'});
display_msg_listener.subscribe(function(data) {
            parse_data(data);});

var state_server_publisher = new ROSLIB.Topic({ros : ros,name : "/human_interface_reply",messageType : 'domain_handler_msgs/HumanInterfaceReply'});

var domain_handler_publisher = new ROSLIB.Topic({ros : ros,name : "/human_interface_confirmation",messageType : 'std_msgs/Int32'});


let viz_data;
let sliders = [];

function button_click(i){
  console.log("button_pressed");
  buttons_data  = viz_data.buttons.slice();
  sliders_data = viz_data.sliders.slice()

  for(let j = 0; j < sliders_data.length;j++){
    curr_slider = document.getElementById(sliders[j]);
    console.log(curr_slider.value)
    sliders_data[j].value = parseInt(curr_slider.value);
  }

  buttons_data[i].value = true;

  var return_msg = new ROSLIB.Message({
      buttons: buttons_data,
      sliders: sliders_data,
      text_inputs: viz_data.text_inputs,
      Bbox: viz_data.boxes
    });

  state_server_publisher.publish(return_msg);

  var confirmation_msg = new ROSLIB.Message({data: 1});
  domain_handler_publisher.publish(confirmation_msg);

  console.log(return_msg)

  if (viz_data.display_type == 0){
    clear_screen(clear_visuals=false);
  }
  else{
    clear_screen();
    display_default_screen();
  }
}



function generate_buttons(buttons_array){
  var container = document.getElementById('button_container');

  for(let i = 0;i < buttons_array.length;i++){
    var button = document.createElement('input');
    button.type = 'button';
    button.id = buttons_array[i].text;
    button.value = buttons_array[i].name;
    button.className = 'btn btn-outline-secondary';
    button.onclick = function() {button_click(i);};
     container.appendChild(button);
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
  for(let i = 0;i < sliders_array.length;i++){
    generate_slider(sliders_array[i].name,sliders_array[i].text,sliders_array[i].min.toString(),sliders_array[i].max.toString());
    sliders.push(sliders_array[i].name);
  }
}

function parse_data(data){
  console.log(data)
  if (data.display_type == 0 ){
    viz_data = data
    document.getElementById("msg").innerHTML = data.instruction_text;
    generate_buttons(data.buttons)
    generate_sliders(data.sliders)
  }
}

function display_default_screen(){
  
  camera_div = document.createElement('div');
  camera_div.id = "mjpeg";
  camera_div.className = "col-sm";

  camera_viz = document.createElement('script'); 
  camera_viz.id = "camera";
  camera_viz.src = "./mjpeg_canvas_viewer.js";

  robot_div = document.createElement('div');
  robot_div.id = "robot_div";
  robot_div.className = "col-sm";

  robot_viz = document.createElement('script'); 
  robot_viz.id = "robot";
  robot_viz.src = "./bundle/simple.js";

  robot_canvas = document.createElement('canvas');
  robot_canvas.id = "robot_canvas";
  robot_canvas.className = "robot_viz";

  var container = document.getElementById('visuals_container');

  container.appendChild(camera_div);
  camera_div.appendChild(camera_viz);

  container.appendChild(robot_div);
  robot_div.appendChild(robot_canvas);
  robot_div.appendChild(robot_viz);
  
}

function clear_screen(clear_visuals=true){
  document.getElementById("msg").innerHTML = "";
  document.getElementById('button_container').innerHTML = "";
  document.getElementById('slider_container').innerHTML = "";
  sliders = [];
  if (clear_visuals) document.getElementById('visuals_container').innerHTML = "";
}

console.log("listening to data")

display_default_screen();
//generate_buttons(["hi","bye","option 1","option 2","option 3"]);
//generate_sliders([["slider_1",1,10],["slider_dedewd2",5,100]]);
