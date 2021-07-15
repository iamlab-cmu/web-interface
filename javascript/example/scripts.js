var ros = new ROSLIB.Ros({
            url : 'ws://iam-wanda.ri.cmu.edu:9090'
          });
ros.on('connection', function() {document.getElementById("status").innerHTML = "Connected";});

ros.on('error', function(error) {document.getElementById("status").innerHTML = "Error";});

ros.on('close', function() {document.getElementById("status").innerHTML = "Closed";});


var display_msg_listener = new ROSLIB.Topic({ros : ros,name : "/mock_human_interface_publisher",messageType : 'domain_handler_msgs/HumanInterfaceRequest'});

var state_server_publisher = new ROSLIB.Topic({ros : ros,name : "/state_server",messageType : 'domain_handler_msgs/HumanInterfaceReply'});

var domain_handler_publisher = new ROSLIB.Topic({ros : ros,name : "/domain_handler",messageType : 'std_msgs/Int32'});


let viz_data;

function button_click(i){
  console.log("button_pressed");
  new_buttons_data  = viz_data.buttons.slice();
  new_buttons_data[i].value = true;

  var return_msg = new ROSLIB.Message({
      buttons: new_buttons_data,
      sliders: viz_data.sliders,
      text_inputs: viz_data.text_inputs,
      Bbox: viz_data.boxes
    });

  state_server_publisher.publish(return_msg);

  var confirmation_msg = new ROSLIB.Message({data: 1});
  domain_handler_publisher.publish(confirmation_msg);

  console.log(return_msg)

  clear_screen();
}



function generate_buttons(buttons_array){
  for(let i = 0;i < buttons_array.length;i++){
    var button = document.createElement('input');
    button.type = 'button';
    button.id = buttons_array[i].text;
    button.value = buttons_array[i].name;
    button.className = 'button';
    button.onclick = function() {button_click(i);};
 
    var container = document.getElementById('button_container');
    container.appendChild(button);
  }
}

function generate_slider(name,min,max){
  var slider_container = document.createElement('div');
  var description = document.createElement('p');
  description.innerHTML = name;
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

  var container = document.getElementById('button_container');
  container.appendChild(slider_container);
}

function generate_sliders(sliders_array){
  for(let i = 0;i < sliders_array.length;i++){
    generate_slider(sliders_array[i][0],sliders_array[i][1].toString(),sliders_array[i][2].toString());
  }
}

function parse_data(data){
  if (data.display_type == 0 ){
    viz_data = data
    document.getElementById("msg").innerHTML = data.instruction_text;
    generate_buttons(data.buttons)
  }
}

function display_default_screen(){

  robot_viz_div = document.createElement('div');
  
  camera_div = document.createElement('div');
  camera_div.id = "mjpeg";

  robot_viz = document.createElement('script'); 
  robot_viz.id = "robot";
  robot_viz.src = "./bundle/simple.js";

  robot_canvas = document.createElement('canvas');
  robot_canvas.id = "robot_canvas";
  robot_canvas.className = "robot_viz";

  var container = document.getElementById('row');
  //container.appendChild(robot_viz_div);
  //
  container.appendChild(robot_canvas);
  container.appendChild(robot_viz);
  

  container.appendChild(camera_div);
}

function clear_screen(){
  document.getElementById("msg").innerHTML = "";
  document.getElementById('button_container').innerHTML = "";
}

console.log("listening to data")
display_msg_listener.subscribe(function(data) {
            parse_data(data);
        });

display_default_screen();
//generate_buttons(["hi","bye","option 1","option 2","option 3"]);
//generate_sliders([["slider_1",1,10],["slider_dedewd2",5,100]]);
console.log("executed creating buttons");