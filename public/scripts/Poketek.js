var socket;

var Poketek = {
  canvas: document.getElementById("canvas"),
  context: canvas.getContext("2d"),
  socket: socket,
  players: [],
  map: {},
  player: {
    id: 0,
    position: {
      x: 0,
      y: 0,
    },
    direction: 0,
    move: function(direction) {
      Poketek.player.direction = direction;
      switch(direction)
      {
        case 0: // DOWN
          Poketek.player.position.y += 5;
          break;
        case 2: // UP
          Poketek.player.position.y -= 5;
          break;
        case 3: // RIGHT
          Poketek.player.position.x += 5;
          break;
        case 1: // LEFT
          Poketek.player.position.x -= 5;
          break;
      }
      socket.emit('move', { player: Poketek.player });
    },
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  start: function(assets) {
    socket.emit('join', { player: Poketek.player });
    this.assets = assets;
    animate();
  },
  drawMap: function() {
    if (!Poketek.map.backgrounds)
      return;
    Poketek.map.backgrounds.forEach(function(item) {
      if (!item)
        return;
      switch(item.type)
      {
        case "tree_1":
          Poketek.context.drawImage(assets.global_tilesets, 20, 0, 40, 50, item.x, item.y, 40, 50);
          break;
        case "tree_2":
          Poketek.context.drawImage(assets.global_tilesets, 67, 0, 40, 50, item.x, item.y, 40, 50);
          break;
      }
    });
  },
  drawPlayers: function() {
    Poketek.players.forEach(function(data) {
      if (!data)
        return;
      var player = data.player;
      Poketek.context.drawImage(assets.player, (player.direction * 2) + (player.direction * (17 * 3)), 0, 18, 19, player.position.x, player.position.y, 17, 19);      
    });
  },
  update: function() {
    this.clear();
    this.drawMap();
    this.drawPlayers();
  }
};

function animate() {
  window.requestAnimFrame(animate);
  Poketek.update();
}

var ASSETS = ['global_tilesets', 'house', 'player'];
window.onload = function() {
  socket = io.connect('http://localhost:3000');
  socket.on('connect', function(data) {
    loadAssets(ASSETS, Poketek.start);
  });
  socket.on('id', function(data) {
    Poketek.player.id = data;
  });
  socket.on('players', function(data) {
    Poketek.players = data;
  });
  socket.on('map', function(data) {
    console.log("Map was updated");
    console.log(data);
    Poketek.map = data;
  });
}

document.addEventListener("keydown", keyDownHandler, false);
function keyDownHandler(e) {
  switch(e.keyCode)
  {
    case 40: // DOWN
      Poketek.player.move(0);
      break;
    case 38: // UP
      Poketek.player.move(2);
      break;
    case 39: // RIGHT
      Poketek.player.move(3);
      break;
    case 37:
      Poketek.player.move(1);
      break;
    case 49:
      socket.emit('add_background', { type: "tree_1", x: Poketek.player.position.x, y: Poketek.player.position.y });
      break;
    case 50:
      socket.emit('add_background', { type: "tree_2", x: Poketek.player.position.x, y: Poketek.player.position.y });
      break;
    default:
      console.log("Keypressed: " + e.keyCode);
  }
}

window.onbeforeunload = function(e) {
  socket.close();
};