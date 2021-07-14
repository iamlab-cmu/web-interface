var ros = new ROSLIB.Ros({
            url : 'ws://iam-wanda.ri.cmu.edu:9090'
          });

          ros.on('connection', function() {
            document.getElementById("status").innerHTML = "Connected";
          });

          ros.on('error', function(error) {
            document.getElementById("status").innerHTML = "Error";
          });

          ros.on('close', function() {
            document.getElementById("status").innerHTML = "Closed";
          });

            var txt_listener = new ROSLIB.Topic({
            ros : ros,
            name : '/txt_msg',
            messageType : 'std_msgs/String'
            });

            var robot_listener = new ROSLIB.Topic({
            ros : ros,
            name : '/robot_state_publisher_node_1/robot_state',
            messageType : 'franka_interface_msgs/RobotState'
            });

          txt_listener.subscribe(function(m) {
            document.getElementById("msg").innerHTML = m.data;
          });

          cmd_vel_listener = new ROSLIB.Topic({
    ros : ros,
    name : "/cmd",
    messageType : 'std_msgs/Int32'
  });

  move = function (value) {
    var msg = new ROSLIB.Message({data: value});
    cmd_vel_listener.publish(msg);
  }

function log_info(val) {
              move(val)
            }

function generate_buttons(buttons_array){
  for(let i = 0;i < buttons_array.length;i++){
    var button = document.createElement('input');
    button.type = 'button';
    button.id = buttons_array[i];
    button.value = buttons_array[i];
    button.className = 'button';
    button.onclick = log_info(i);
 
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

//generate_buttons(["hi","bye","option 1","option 2","option 3"]);
generate_sliders([["slider_1",1,10],["slider_dedewd2",5,100]]);
console.log("executed creating buttons");