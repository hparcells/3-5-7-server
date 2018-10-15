const port = 3000;

var server = require("http").createServer();
var io = require("socket.io")(server);

var users = [];
var marks = [
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
    {isMarked: false},
];

io.on("connection", function(client) {
    client.on("newPlayer", function(data) {
        users.push(data);

        console.log(`${data} joined!`);

        io.emit("playerUpdate", users);
    });

    client.on("playerDisconnect", function(data) {
        var position = users.indexOf(data);
        users.splice(position, 1);

        io.emit("playerUpdate", users);
    });

    client.on("updatedMark", function(className, idName) {
        io.emit("markUpdate", className, idName);
    });

    client.on("updatedMarkList", function(data) {
        marks = data;

        io.emit("updatedMarks", marks);
    });

    client.on("switchTurns", function() {

    });
});

server.listen(port);
