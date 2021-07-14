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