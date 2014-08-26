/** Derivative/d
 * Test node.js that can be run when there's isn't an Arduino available
 */

var net = require('net');

// Keep a list of people who connected
var clients = [];

// Keep a list of drive commands
var driveCmds = {};
var cmdCount = 0;

var server = net.createServer(function (socket) {
    // Identify client
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    console.log(socket.name + " - has connected");

    // Put this new client in the list
    clients.push(socket);

    // Handle incoming data from client
    socket.on('data', function (data) {
        message = data.toString('utf8', 0, data.len);

        console.log("Recieved: " + message);
        ProcessCommand(message);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        console.log(socket.name + " - has disconnected");
    });
});

server.listen(1337, '127.0.0.1');
/*
board = new five.Board();

board.on("ready", function () {
    // create drive motors
    wheels = {};

    // Create two servos as our wheels
    wheels.left = new five.Servo({
        pin: 4,
        type: "continuous",
        range: [40, 140],
        isInverted: true // the robot will be facing the other way in this case
    });

    wheels.right = new five.Servo({
        pin: 5,
        type: "continuous",
        range: [40, 140],
        isInverted: true // the robot will be facing the other way in this case
    });

    wheels.both = new five.Servos().stop(); // reference both together

    // Create two example servos on pins 9 and 10
    // Left lifter - the one that works
    lifter = new five.Servo({
        pin: 10,
        // Limit this servo to 170°
        range: [70, 180],
        startAt: 70,
    });

    five.Servo(9);

    // Initialize a reference to all Servo instances
    // five.Servo.Array()
    // five.Servos()
    allMotors = new five.Servos();

    // Inject the `servo` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
        wheels: wheels
    });
    board.repl.inject({
        allMotors: allMotors
    });
});*/

function ProcessCommand(message) {
    // The message will be a stream section, so separate out into individual messages
    var parsedMessage = message.split("#");

    for (var i = 0; i < parsedMessage.length; i++) {
        if (parsedMessage[i]) {
            var parsedCommand = parsedMessage[i].split("-");
            console.log("Command: " + parsedCommand);

            var driveTime = 1000;           // Default driveTime is 1 second
            var turnRate = 90;              // Default turn is neutral

            // Drop everythuinging
            if (parsedCommand[0] == 'emergency') {
                DriveStop();
                allMotors.stop();
            }

            // Generic (maxed) movement indicators
            if (parsedCommand[0] == 'stop') {
                DriveStop();
            }
            if (parsedCommand[0] == 'forward') {
                //wheels.both.cw();

                // Assumes the second argument is amount of milliseconds to drive before stopping
                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                console.log("Moving forward for " + driveTime);

                driveCmds[cmdCount] = true;
                cmdCount++;
                //board.wait(driveTime, EndDrive);
            }
            if (parsedCommand[0] == 'back') {
                //wheels.both.ccw();

                // Assumes the second argument is amount of milliseconds to drive before stopping
                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                console.log("Moving backward for " + driveTime);

                driveCmds[cmdCount] = true;
                cmdCount++;
                //board.wait(driveTime, EndDrive);
            }
            if (parsedCommand[0] == 'left') {
                //wheels.left.ccw();
                //wheels.right.cw();

                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }

                // Assumes the second argument is amount of milliseconds to turn before stopping
                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                console.log("Turning left for " + driveTime);

                driveCmds[cmdCount] = true;
                cmdCount++;
                //board.wait(driveTime, EndDrive);
            }
            if (parsedCommand[0] == 'right') {
                //wheels.left.cw();
                //wheels.right.ccw();

                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }

                // Assumes the second argument is amount of milliseconds to turn before stopping
                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                console.log("Turning right for " + driveTime);

                driveCmds[cmdCount] = true;
                cmdCount++;
                //board.wait(driveTime, EndDrive);
            }
            if (parsedCommand[0] == 'raise') {
                //lifter.max();
            }
            if (parsedCommand[0] == 'lower') {
                //lifter.min();
            }

            // Specific motor values
            if (parsedCommand[0] == 'driveleft') {
                if (parsedCommand.length > 2) {
                    // Assumes the second argument is amount degree of turn for drive motor
                    turnRate = parseInt(parsedCommand[1]);
                    // Assumes the third argument is amount of milliseconds to turn before stopping
                    driveTime = parseInt(parsedCommand[2]);
                }

                wheels.left.to(turnRate);

                console.log("Turning left wheel: " + turnRate + " for: " + driveTime);

                driveCmds[cmdCount] = true;
                cmdCount++;
                //board.wait(driveTime, EndDrive);
            }
            if (parsedCommand[0] == 'driveright') {
                if (parsedCommand.length > 2) {
                    // Assumes the second argument is amount degree of turn for drive motor
                    turnRate = parseInt(parsedCommand[1]);
                    // Assumes the third argument is amount of milliseconds to turn before stopping
                    driveTime = parseInt(parsedCommand[2]);
                }

                wheels.right.to(turnRate);

                console.log("Turning right wheel: " + turnRate + " for: " + driveTime);

                driveCmds[cmdCount] = true;
                cmdCount++;
                //board.wait(driveTime, EndDrive);
            }
            
            if (parsedCommand[0] == 'lift') {
                var liftTo = lifter.max;
                if (parsedCommand.len > 1) {
                    liftTo = parseInt(parsedCommand[1])
                }
                lifter.to(listTo);
            }
        }
    }
}

// automatic stop timeout for drive motor commands
//  want to avoid a glitch causing the robot to drive forward forever
//  only stops if no more drive commands are left in the queue
function EndDrive (cmdId) {
    if (driveCmds[cmdId]) {
        delete driveCmds[cmdId];
    }
    if (driveCmds.keys.length == 0) {
        DriveStop();
    }
}

// Stops the drive motors (and resets the drive command queue)
function DriveStop() {
    //wheels.both.stop();
    driveCmds = {};
    cmdCount = 0;
}