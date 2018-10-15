const port = 3000;

var server = require("http").createServer();
var io = require("socket.io")(server);

var users = [];

io.on("connection", function(client) {
    client.on("join", function(data) {
        if(users.length < 2) {
            users.push(data);
        }

        console.log(`${data} joined!`); 
        
        client.emit("join", users);
    });

    client.on("updatedMark", function(data) {
        client.broadcast.emit("updatedMark", data);
    });

    client.on("disconnect", function() {
        console.log("Someone Disconnected!");

        // TODO: Remove from users.
    });
});

server.listen(port);