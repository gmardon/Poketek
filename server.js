var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var router = express.Router();
var players = [];
var map = {
    backgrounds: [
        {
            type: "tree_1",
            x: 0,
            y: 0,
            level: 1,
        },
        {
            type: "tree_1",
            x: 40,
            y: 0,
            level: 1,
        },
        {
            type: "tree_2",
            x: 80,
            y: 0,
            level: 1,
        }
    ],
    grounds: [

    ]
};
var maxId = 0;

router.get('/', function(req, res) {
    res.json({ message: 'Basic REST API call.' });   
});

app.use('/api', router);
app.use(express.static('public'))

io.on('connection', function(client) {
    var id = maxId++;
    client.emit('id', id);
    client.on('join', function(data) {
        players[id] = data;
        io.sockets.emit('players', players);
        io.sockets.emit('map', map);
    });
    client.on('move', function(data) {
        console.log("Player #" + id + " moved");
        players[id] = data;
        io.sockets.emit('players', players);
    });
    client.on('disconnect', function(data) {
        console.log("Player #" + id + " disconnected");
        delete players[id];
        io.sockets.emit('players', players);
    });
    client.on('add_background', function(data) {
        map.backgrounds.push(data);
        io.sockets.emit('map', map);
    });
    client.on('add_ground', function(data) {
        map.grounds.push(data);
        io.sockets.emit('map', map);
    });
});

server.listen(port);
console.log('Poketek started on: ' + port);