# web-interface

## Installation Instructions
1. Install ROS Melodic following instructions here: http://wiki.ros.org/melodic/Installation/Ubuntu
2. Install Node.js.
```
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install -y nodejs
```
3. Install rosbridge server.
```
sudo apt install ros-melodic-rosbridge-server
```
4. Install web_video_server.
```
sudo apt install ros-melodic-web-video-server
```
5. Clone this repository.
```
git clone https://github.com/iamlab-cmu/web-interface.git
```
6. Install node js packages required.
```
cd web-interface/javascript
npm install
```
7. Modify Line 1 in javascript/example/scripts.js and set it to the ip address of the computer.
```
let host_name = "localhost"
```

## Running Instructions
1. Start a roscore.
```
roscore
```
2. Start the rosbridge server.
```
roslaunch rosbridge_server rosbridge_websocket.launch
```
3. Start the web_video_server.
```
rosrun web_video_server web_video_server
```
4. Start the web server.
```
cd web-interface/javascript
npm start
```
5. Navigate to localhost:9080/javascript/example/simple.html in your web browser.
