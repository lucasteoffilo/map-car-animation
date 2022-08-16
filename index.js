'use strict';

var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  port = process.env.PORT || 5000;

app.use(express.static('public'));

var x = -43.4056066666667;
var y = -22.90199;

io.on('connection', function (socket) {
  gerador_coordenadas();

  function gerador_coordenadas() {
    var coordenadas = [];
    x -= 0.0000051;
    y -= 0.0040001;
    coordenadas.push(x);
    coordenadas.push(y);
    console.log(coordenadas);
    io.emit('coordenadas', {
      coordenadas
    });
    setTimeout(gerador_coordenadas, 10000);
  }
});

http.listen(port, function () {
  console.log('Servidor rodando na porta:' + port);
});