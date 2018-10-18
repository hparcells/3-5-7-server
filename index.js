const port = 3000;

var server = require("http").createServer();
var io = require("socket.io")(server);

var users = [];
var player = 1;

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

    client.on("updatedMark", function(className, idName) {
        io.emit("markUpdate", className, idName);
    });

    client.on("switchTurns", function(data) {
        if(data === 1) {
            player = 2;
        }else {
            player = 1;
        }

        io.emit("turnUpdate", player);
    });

    client.on("reset", function(data) {
        users = [];
        player = 1;

        console.log("Reset!");
    });
});

server.listen(port);
