kinect-butler
=============

***Currently under development***

A Kinect Visual Studios program that operates the Kinect and makes robot decisions. See the project on HackADay: http://hackaday.io/project/2114-Robot-Butler

Though, the robot will act act more as a support escort:
 * follow people around
 * lift a tray that can be used to hold beverages
 * accepts vocal commands
 * play intriguing music on demand

Requirements
------------

 * Windows 8 (yeah I know, boooo)
 * Visual Studio (to edit)
 * Attached Kinect
 * Attached Arduino Mega
 * [Nodejs](http://nodejs.org/)
  * Go to supportCode / nodeSergei directory (the node program)
  * [Install johhny-five](https://github.com/rwaldron/johnny-five)
  * npm install johnny-five
  * You might need to add a 'npm' folder in AppData / Roaming


Instructions
------------

 * Make sure the Kinect and Arduino Mega are attached
 * Open the node command prompt and run the node TCP server
  * node SergeiController.js
 * Open LittleSergei in Visual Studio and run the project

Current the program...
----------------------

 * lifts one of the lift
 * moves forward unless the Kinect detects a body
 * stops if the Kinect detects the body
 * on Kinect window close: move backward briefly and lowers the lift
