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

var udpPort = last_udp_port = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 5000
});

udpPort.open();
var last_udp_bind = false
udpPort.on("message", function(){
  if (last_udp_bind) {
    last_udp_bind.apply(this, arguments)
  }
});

io.on('connection', function (socket) {
  console.log('New connection')
  
  socket.on('error', function(){
    console.error(arguments)
  })

  socket.on('s', function(value){
    console.log('New connection init')
    var addresses = value[0]
    var average_over = value[1]
    
  var locked = []
  var checkLock = function(b){
    if(locked[b]){
      return false;
    }
    locked[b] = true;
    setTimeout(function(){
      locked[b] = false;
    }, 30);
    return true;
  }
  var r = []
  var avgMe = function(b,avg){
    if(!r[b])
      r[b] = new Array(average_over).fill(0)
    r[b].unshift(avg)
    r[b].pop()
    return r[b].reduce(function(prev, cur){ return (prev || 0) + cur }) / r[b].length
  }
    var udpBind = last_udp_bind = function (oscData) {
      var i = addresses.indexOf(oscData.address)
      if (i !== -1) {
        // if (checkLock(i)) {
  		    socket.emit('l', [i,avgMe(i,(oscData.args[0]+oscData.args[1])/2)]);
  		    socket.emit('r', [i,avgMe(i+10,(oscData.args[2]+oscData.args[3])/2)]);
          // socket.emit('m', [i,Math.round(50*arr.meanAbsoluteDeviation([
          //   oscData.args[0],
          //   oscData.args[1],
          //   oscData.args[2],
          //   oscData.args[3]
          // ]))])
        // }
      }
      if (oscData.address === '/muse/config') {
        socket.emit('b', JSON.parse(oscData.args[0]).battery_percent_remaining)
      }
  	}
    socket.on('e', function(){
      console.log('closing')
    })
    socket.on('disconnect', function(){
      console.log('disconnecting')
    })
  })

});

var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log("Listening on " + port);
});

var arr = {	
	max: function(array) {
		return Math.max.apply(null, array);
	},
	
	min: function(array) {
		return Math.min.apply(null, array);
	},
	
	range: function(array) {
		return arr.max(array) - arr.min(array);
	},
	
	midrange: function(array) {
		return arr.range(array) / 2;
	},

	sum: function(array) {
		var num = 0;
		for (var i = 0, l = array.length; i < l; i++) num += array[i];
		return num;
	},
	
	mean: function(array) {
		return arr.sum(array) / array.length;
	},
	
	median: function(array) {
		array.sort(function(a, b) {
			return a - b;
		});
		var mid = array.length / 2;
		return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
	},
	
	modes: function(array) {
		if (!array.length) return [];
		var modeMap = {},
			maxCount = 1,
			modes = [array[0]];

		array.forEach(function(val) {
			if (!modeMap[val]) modeMap[val] = 1;
			else modeMap[val]++;

			if (modeMap[val] > maxCount) {
				modes = [val];
				maxCount = modeMap[val];
			}
			else if (modeMap[val] === maxCount) {
				modes.push(val);
				maxCount = modeMap[val];
			}
		});
		return modes;
	},
	
	variance: function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.pow(num - mean, 2);
		}));
	},
	
	standardDeviation: function(array) {
		return Math.sqrt(arr.variance(array));
	},
	
	meanAbsoluteDeviation: function(array) {
		var mean = arr.mean(array);
		return arr.mean(array.map(function(num) {
			return Math.abs(num - mean);
		}));
	},
	
	zScores: function(array) {
		var mean = arr.mean(array);
		var standardDeviation = arr.standardDeviation(array);
		return array.map(function(num) {
			return (num - mean) / standardDeviation;
		});
	}
};

// Function aliases:
arr.average = arr.mean;