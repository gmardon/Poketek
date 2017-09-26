var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var router = express.Router();
var players = [];
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
    });
    client.on('move', function(data) {
        console.log("Player #" + id + " moved");
        players[id] = data;
        io.sockets.emit('players', players);
    });
    client.on('disconnect', function(data) {
        console.log("end");
        delete players[id];
        io.sockets.emit('players', players);
    });
    /*client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });*/
});

server.listen(port);
console.log('Poketek started on: ' + port);