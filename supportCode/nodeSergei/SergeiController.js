var net = require('net');

// Keep a list of people who connected
var clients = [];

var five = require("johnny-five"),
  board, wheels, lifter, allMotors;

var server = net.createServer(function (socket) {
    // Identify client
    socket.name = socket.remoteAddress + ":" + socket.remotePort
    console.log(socket.name + " - has connected");

    // Put this new client in the list
    clients.push(socket);

    //socket.write('Echo server\r\n');
    //socket.pipe(socket);

    // Handle incoming data from client
    socket.on('data', function (data) {
        message = data.toString('utf8', 0, data.len);

        console.log("Recieved: " + message);
        ProcessCommand(message);
        //broadcast(socket.name + "> " + data, socket);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        console.log(socket.name + " - has disconnected");
    });
});

server.listen(1337, '127.0.0.1');

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
});

function ProcessCommand(message) {
    // The message will be a stream section, so separate out into individual messages
    var parsedMessage = message.split("#");

    for (var i = 0; i < parsedMessage.length; i++) {
        if (parsedMessage[i]) {
            var parsedCommand = parsedMessage[i].split("-");
            console.log("Command: " + parsedCommand);

            var driveTime = 1000;           // Default driveTime is 1 second

            // Drop everythuinging
            if (parsedCommand[0] == 'emergency') {
                allMotors.stop();
            }

            // Generic (maxed) movement indicators
            if (parsedCommand[0] == 'stop') {
                wheels.both.stop();
            }
            if (parsedCommand[0] == 'forward') {
                wheels.both.cw();

                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                console.log("Moving forward for " + driveTime);

                // Assumes the second argument is amount of milliseconds to drive before stopping
                board.wait(driveTime, function () {
                    wheels.both.stop();
                });
            }
            if (parsedCommand[0] == 'back') {
                wheels.both.ccw();
                console.log("Moving backward for " + driveTime);

                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                // Assumes the second argument is amount of seconds to drive before stopping
                board.wait(driveTime, function () {
                    wheels.both.stop();
                });
            }
            if (parsedCommand[0] == 'left') {
                wheels.left.cw();
                wheels.right.ccw();
                console.log("Turning left for " + driveTime);

                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                // Assumes the second argument is amount of milliseconds to drive before stopping
                board.wait(driveTime, function () {
                    console.log("Moving forward");
                    wheels.both.stop();
                });
            }
            if (parsedCommand[0] == 'right') {
                wheels.left.ccw();
                wheels.right.cw();
                console.log("Turning right for " + driveTime);

                if (parsedCommand.length > 1) {
                    driveTime = parseInt(parsedCommand[1])
                }
                // Assumes the second argument is amount of milliseconds to drive before stopping
                board.wait(driveTime, function () {
                    console.log("Moving forward");
                    wheels.both.stop();
                });
            }
            if (parsedCommand[0] == 'raise') {
                lifter.max();
            }
            if (parsedCommand[0] == 'lower') {
                lifter.min();
            }

            // Specific motor values
            if (parsedCommand[0] == 'drive') {
                //servo.to( 90 );
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