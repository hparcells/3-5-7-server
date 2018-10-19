const port = 3000;

var server = require("http").createServer();
var io = require("socket.io")(server);

var users = [];
var player = 1;

console.log("Starting Server...");

io.on("connection", function(client) {
    client.on("newPlayer", function(data) {
        users.push(data);

        console.log(`${data} joined!`);

        io.emit("playerUpdate", users);
    });

    client.on("playerDisconnect", function(data) {
        var position = users.indexOf(data);
        users.splice(position, 1);

        console.log(`${data} left!`);

        io.emit("playerUpdate", users);
    });

    client.on("updatedMark", function(row, mark) {
        io.emit("markUpdate", row, mark);

        console.log(`Updated Mark: ${mark}.`)
    });

    client.on("switchTurns", function(data) {
        if(data === 1) {
            player = 2;
        }else {
            player = 1;
        }

        io.emit("turnUpdate", player);

        console.log(`Switching to Player ${player}.`)
    });

    client.on("reset", function() {
        users = [];
        player = 1;

        console.log("Reset!");
    });
});

server.listen(port);

var os = require("os");
var ifaces = os.networkInterfaces();
console.log('Listening On: ');
Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        // this interface has only one ipv4 adress
        console.log("http://" + iface.address + ":" + port +"/");

        ++alias;
    });
});
