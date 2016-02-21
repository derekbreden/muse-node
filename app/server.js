var express = require('express');
var app = express();
var redis = require('redis')
var osc = require('osc')

var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

var lastPointTime = Date.now();
var now;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(express.static(__dirname + '/public'));

var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 5001
});

udpPort.open();

io.on('connection', function (socket) {
    console.log("socket.io connection");
  	socket.emit('news', { hello: 'world' });  
/*
	setInterval(function(){
		var testData = {
			address: "/muse/eeg",
			args: [100, 200, 300, 400]
		}
		socket.emit('news', testData); 
	}, 1000);
*/
  	// Listen for incoming OSC bundles.
  var addresses = [
      '/muse/elements/alpha_relative',
      '/muse/elements/beta_relative',
      '/muse/elements/gamma_relative',
      '/muse/elements/delta_relative',
      '/muse/elements/theta_relative'
    ]
var locked = []
checkLock = function(b){
  if(locked[b]){
    return false;
  }
  locked[b] = true;
  setTimeout(function(){
    locked[b] = false;
  }, 500);
  return true;
}
var r = []
avgMe = function(b,avg){
  if(!r[b])
    r[b] = [0,0,0,0,0,0,0,0,0,0]
  r[b].push(avg)
  r[b].shift()
  return (r[b][0] + r[b][1] + r[b][2] + r[b][3] + r[b][4] + r[b][5] + r[b][6] + r[b][7] + r[b][8] + r[b][9]) / 5
}
	udpPort.on("message", function (oscData) {
    var i = addresses.indexOf(oscData.address)
    if (i !== -1) {
      // if (checkLock(i)) {
		    socket.emit('n', [i,avgMe(i,(oscData.args[0]+oscData.args[1]+oscData.args[2]+oscData.args[3])/4)]);
      // }
    }
	});

});

var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log("Listening on " + port);
});
