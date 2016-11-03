window.w = {
  player: {}
};
$( function() {

    var play_b = function(notes_to_play, note) {
        (function(){ 
            if (w.player[note[0]]){
              w.player[note[0]].play()
              return;
            }
            var conductor = new BandJS();

            conductor.setTimeSignature(4, 4);
            conductor.setTempo(100)//lorr==='l'?160:100);
            var piano = conductor.createInstrument('sine', 'oscillators');
            // var piano2 = conductor.createInstrument('sine', 'oscillators');
            // var piano3 = conductor.createInstrument('sine', 'oscillators');
            // var rightHand = conductor.createInstrument('square', 'oscillators');
            // var leftHand = conductor.createInstrument('triangle', 'oscillators');
            // var drum = conductor.createInstrument('white', 'noises');
            if (note) {
              piano.rest('sixteenth')
              piano.setVolume(note[1])
              piano.note('eighth', note[0])
              
            } else {
              piano.rest('sixteenth')
              piano.setVolume(notes_to_play[0][1])
              piano.note('eighth', notes_to_play[0][0])
              piano.setVolume(notes_to_play[1][1])
              piano.note('sixteenth', notes_to_play[1][0])
              piano.setVolume(notes_to_play[2][1])
              piano.note('sixteenth', notes_to_play[2][0])
              piano.rest('sixteenth')  
            }
            // Bar 35
            // rightHand.note('quarter', b)
            //     .rest('quarter')
            //     .rest('half');
            w.player[note[0]] = conductor.finish();
            w.player[note[0]].play()
            
            // var player = conductor.finish();
            // player.play()
            // conductor.setOnFinishedCallback(function(){
            //   conductor.audioContext.close();
            // })
        })()
    }
  
  w.lastUpdated = new Date()
  w.locked = false;
  w.cache = {};
  setInterval(function(){
    if (new Date() - 1000 > w.lastUpdated)
        return
    
        

    // var play_notes_for_side = function(side){
    //   var notes_to_play = []
    //   w.last[side].forEach(function(val, i){
    //     var rank = w.last[side].map(function(){return arguments[0]}).sort(function(a,b){return b - a}).indexOf(w.last[side][i])
    //     // setTimeout(function(){
    //       // console.log('r', labels[i],w.notes[i],Math.floor(val * 100))
    //     notes_to_play[rank] = [w.notes[i], rank === 0 ? 30 : 0, w.last[side][i], i]
    //       // play_b(w.notes[i], Math.floor(val * 100))
    //     // }, rank * 300)
    //   })
    //   var meh = Math.floor((notes_to_play[0][2] - notes_to_play[1][2])*15)
    //   var vol = meh * 20 + 20
    //   vol = (vol > 100 ? 100 : vol)
    //   notes_to_play[0][1] = vol
    //   if (notes_to_play[0][3] === 1)
    //     w.increment_pac(Math.floor(meh/4) + 1)
    // }
    // play_notes_for_side('r')
    // play_notes_for_side('l')
    
    if (w.last_last){
      var a = w.last.r[0] - w.last_last.r[0]
      // var b = w.last.l[0] - w.last_last.l[0]
      
      var rank1 = w.last.r.map(function(){return arguments[0]}).sort(function(a,b){return b - a}).indexOf(w.last.r[0])
      // var rank2 = w.last.l.map(function(){return arguments[0]}).sort(function(a,b){return b - a}).indexOf(w.last.l[0])
      
      
      var to_increment = 0
      if (rank1 === 0){
        to_increment = 4
      } else {
        if (a > 0)
          to_increment = 2
      }
      // if (w.last_left_right_both === 'right') {
      //   if (rank2 === 0){
      //     to_increment = 2
      //   } else {
      //     if (b > 0)
      //       to_increment = 2
      //   }
      // }
      // if (w.last_left_right_both === 'both') {
      //   if (rank1 === 0 && rank2 === 0){
      //     to_increment = 2
      //   } else {
      //     if (a + b > 0)
      //       to_increment = 2
      //   }
      // }
      if (to_increment)
        w.increment_pac(to_increment)
      w.last_to_increment = to_increment
      
      
      if (to_increment === 2) {
        play_b(false, ['D4', 30])
      }
      if (to_increment === 4) {
        play_b(false, ['E4', 30])
      }
      
    }
    w.last_last = {
      r:Array.prototype.slice.apply(w.last.r),
      l:Array.prototype.slice.apply(w.last.l)
    }
    
    
  }, 500)
    var n = 5,
        random = d3.random.normal( 0, 0 );
        


    w.reset_chart = function(addresses_in, average_over_in, left_right_both_in){
      if (addresses_in) {
        addresses_in = addresses_in.split('').map(function(addy){
          return '/muse/elements/' + {
            a: 'alpha',
            b: 'beta',
            g: 'gamma',
            t: 'theta',
            d: 'delta'
          }[addy] + '_absolute'
        })
      }
      console.log(addresses_in)
      if (!w.socket){
        w.socket = io.connect( "http://localhost:3000" );
        
        w.socket.on('b', function(value){
          $('#battery').html( ''
            + value + '%'
            + '<div class="battery"><div class="level"></div></div>'
          )
          $('.battery .level').width(value + '%')
          if (value < 20) {
            $('.battery .level').css({
              background: '#E66'
            })
          } else if ( value < 40) {
            $('.battery .level').css({
              background: '#EA6'
            })
          } else {
            $('.battery .level').css({
              background: '#EEE'
            })
          }
        })
        w.lorr_function = function(value, lorr) {

              
            if (!w.last){
                w.last = {l:[],r:[]}
            }
            if (!w.last_real_value){
                w.last_real_value = {l:[],r:[]}
            }
            try{
              value[1] = value[1] + 1
              w.last_real_value[lorr][value[0]] = value[1]
              var total = w.last_real_value[lorr].reduce(function(a,b){return (a || 0) + b})
              value[1] = value[1] / total
            }catch(e){}
            var add_point = function(what,where){
              
              var xVal = (new Date()).getTime(), // current time
                  yVal = what;
              w.datas[lorr][where].push( what );
                          w.paths[lorr]
                              .attr( "d", w.lines[lorr] )
                              .attr( "transform", null )
              
                          // pop the old data point off the front
                          w.datas[lorr][where].shift();
            }
            add_point(value[1],value[0])
            w.last[lorr][value[0]] = value[1]


            
            w.last[lorr].forEach(function(thing,i){
              var rank = w.last[lorr].map(function(){return arguments[0]}).sort(function(a,b){return b - a}).indexOf(w.last[lorr][i])
              $('#'+lorr+'-'+i)
                .html(labels[i])
                .parent()
                .css({
                  'font-size': sizes[4 - rank],
                  'line-height': sizes[4 - rank] + 'px',
                  'height': sizes[4 - rank] + 'px',
                  'background': colors[i]
                })
              if (rank === 0){
                var b = w.notes[i]
                w[lorr] = b
                if (thing > .1)
                  w.lastUpdated = new Date()
                if (lorr == 'l'){
                  w.last_l = i
                } else {
                  w.last_r = i
                }
                if (w.last_l === w.last_r) {
                  $('#ur').html('<div>' + phrases[w.last_l] + '</div>')
                } else {
                  $('#ur').html(
                    '<div style="width:50%;">' + phrases[w.last_r] + '</div>'
                    + '<div style="width:50%;">' + phrases[w.last_l] + '</div>'
                  )
              }
             }
          })
        }
        w.lorr_functions = {
          l: function(value){
            w.lorr_function(value, 'l')
          },
          r: function(value){
            w.lorr_function(value, 'r')
          }
        }
      } else {
        w.socket.emit('e')
        // w.svgs.l.remove()
        w.svgs.r.remove()
        // w.socket.off('l', w.lorr_functions.l)
        w.socket.off('r', w.lorr_functions.r)
      }
      
      
      var socket = w.socket;
      
      
      // -------------------------------------------------------------------------
      // -------------------------------------------------------------------------
      //
      //
      //
      //
      var left_right_both = w.last_left_right_both = left_right_both_in || w.last_left_right_both || 'both'
      var addresses = w.last_addresses = addresses_in || w.last_addresses || [
          // '/muse/elements/alpha_absolute',
          '/muse/elements/theta_absolute',
          '/muse/elements/beta_absolute',
          // '/muse/elements/delta_absolute',
          // '/muse/elements/gamma_absolute',
        ]
      var color_choices = {
        '/muse/elements/alpha_absolute': '#336699',
        '/muse/elements/theta_absolute': '#993399',
        '/muse/elements/beta_absolute': '#339933',
        '/muse/elements/delta_absolute': '#990000',
        '/muse/elements/gamma_absolute': ''
      }
      
        // // "#33cc33",
        // "",
        // "#339933",
        // // "#663399",
        // // "#336699"
      var colors = [
        '#339933',
        '#336699',
        '#003366',
        '#003366',
        '#003366'
      ]
      
      w.notes = [
        // 'A4',
        'A3',
        'A4',
        // false,
        // false,
       ]
       var sizes = [12, 18, 24, 48, 72]
       var labels = [
        //  'Alpha',
         'Theta',
         'Beta',
        //  'Delta',
        //  'Gamma'
       ]
       var phrases = [
        // 'Relaxed',
        'Tired',
        'Focus',
        // 'ADHD',
        // 'Stress'
      ]
       var average_over = w.last_average_over = average_over_in || w.last_average_over || 20
       //
       //
       //
       //
       // -------------------------------------------------------------------------
       // -------------------------------------------------------------------------
    
      socket.emit('s', [addresses, average_over])
      var n = 100
      function chart(lorr) {
          var data = [d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random )];

          var margin = {
                  top: 100,
                  right: 0,
                  bottom: 0,
                  left: 0
              },
              width = window.innerWidth - 200,
              height = window.innerHeight;

          var x = d3.scale.linear()
              .domain( [0, n] )
              .range( [0, width] );

          var y = d3.scale.linear()
              .domain( [.1, .4] )
              .range( [height, 0] );

          var line = d3.svg.line()
              .interpolate( "none" )
              .x( function(d, i) {
                  return x( i );
              } )
              .y( function(d) {
                  return y( d );
              } );

          w.svgs = w.svgs || {}
          var svg = w.svgs[lorr] = d3.select( "body" ).append( "p" ).append( "svg" )
              .attr( "width", width + margin.left + margin.right )
              .attr( "height", height + margin.top + margin.bottom )
              .style({
                  position: 'absolute',
                  right: 100,
                  bottom: -1
              })
              .append( "g" )
              .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

          var lines = svg.selectAll( "g" )
              .data( data );
          
          var aLineContainer = lines
              .enter().append( "g" );

          aLineContainer.append( "defs" ).append( "clipPath" )
              .attr( "id", "clip" )
              .append( "rect" )
              .attr( "width", width )
              .attr( "height", height );

          var path = aLineContainer
              .attr( "clip-path", "url(#clip)" )
              .append( "path" )
              .data(data)
              .attr( "class", "line" )
              .style( "stroke", function(d, i) {
                  return colors[i];
              } )
              .style( "stroke-width", 3)
              .style( "stroke-opacity", 1)
              .attr( "d", line )
          

          // tick(path, line, data, x);
          
          w.datas = w.datas || {}
          w.paths = w.paths || {}
          w.lines = w.lines || {}
          w.datas[lorr] = data
          w.paths[lorr] = path
          w.lines[lorr] = line
          socket.on( lorr, w.lorr_functions[lorr]);
      }

      // chart('l');
      chart('r');
    }

    
    w.draw_pac = function(){
      $('#pac').css({
        left: w.pac_position * 6 + 0,
        top: 0
      })
      .removeClass('f1 f2 f3 f4 f5 f6 f7 f8')
      .addClass(
        ['f1','f2'][((Math.floor(w.pac_position)) % 2)]
      )
      $('#past1').css({
        width: w.pac_position * 6 + 0
      })
    }
    w.increment_pac = function(n){
      
        if (!w.pac_start)
          w.pac_start = new Date()
        if (w.pac_paused) return
        if (!w.pac_position) {
          w.pac_position = 0
        }
        for (var i = 0; i < n; i++){
          setTimeout(function(){
            w.pac_position++
            w.draw_pac()
          }, i*250)
        }
        if (w.pac_position > 102){
          w.pac_paused = true
          setTimeout(function(){
            $('#pac-container').hide()
            w.pac_position = 0
            w.draw_pac()
            setTimeout(function(){
              $('#pac-container').show()
              w.pac_paused = false
            }, 100)
          }, 100)
        }
    }

    
    $('#addresses :nth-child(1)').click()
    $('#average_over :nth-child(1)').click()
    $('#left_right_both :nth-child(1)').click()

} );


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
