const port = 3000;

var server = require("http").createServer();
var io = require("socket.io")(server);

var users = [];

io.on("connection", function(client) {
    client.on("newPlayer", function(data) {
        if(users.length < 2) {
            users.push(data);

            console.log(`${data} joined!`);
    
            io.emit("playerUpdate", users);
        }
    });

    client.on("playerDisconnect", function(data) {
        var position = users.indexOf(data);
        users.splice(position, 1);

        io.emit("playerUpdate", users);
    });

    client.on("updatedMark", function(data) {
        client.broadcast.emit("updatedMark", data);
    });

    client.on("switchTurns", function() {

    });
});

server.listen(port);
