$( function() {

    var play_b = function(b, lp) {
      if (!b) return
        if(w.cache[b]){
    w.cache[b]()
    return
  }
  (function(){ 
    var conductor = new BandJS();

    conductor.setTimeSignature(4, 4);
    conductor.setTempo(140);
    var piano = conductor.createInstrument('sine', 'oscillators');
    // var rightHand = conductor.createInstrument('square', 'oscillators');
    // var leftHand = conductor.createInstrument('triangle', 'oscillators');
    // var drum = conductor.createInstrument('white', 'noises');
    piano.setVolume(100)
    piano.note('eighth', b)
    // Bar 35
    // rightHand.note('quarter', b)
    //     .rest('quarter')
    //     .rest('half');
    var player = conductor.finish();
    w.cache[b] = function(){
        player.play();
    }
  })()
  w.cache[b]()
    }
  
  window.w = {};
  
  w.locked = false;
  w.cache = {};
  setInterval(function(){
    play_b(w.l)
    setTimeout(function(){
        play_b(w.r)
    }, 400)
  }, 2000)
    var n = 5,
        random = d3.random.normal( 0, 0 );
        
                    
    var socket = io.connect( "http://localhost:3000" );
    
    
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    //
    //
    //
    //
    var addresses = [
        '/muse/elements/alpha_relative',
        '/muse/elements/theta_relative',
        '/muse/elements/beta_relative',
        '/muse/elements/delta_relative',
        '/muse/elements/gamma_relative',
      ]
    var colors = [
      "#33cc33",
      "#993366",
      "#996633",
      "#663399",
      "#336699"];
    var notes = [
      // Alpha 0
          'A4', // YEA RELAXED!
      // Theta 1
          'A2', // MEH
      // Beta 2
          'A5', // YEA FOCUSED!
      // Delta 3
          false, // NORMAL (shrug)
      // Gamma 4
          'A3', // MEH
     ]
     var sizes = [12, 18, 24, 48, 72]
     var labels = [
       'Alpha',
       'Theta',
       'Beta',
       'Delta',
       'Gamma'
     ]
     var average_over = 10
     //
     //
     //
     //
     // -------------------------------------------------------------------------
     // -------------------------------------------------------------------------
  
    socket.emit('s', [addresses, average_over])
    socket.on('b', function(value){
      $('#battery').html( ''
        + value + '%'
        + '<div class="battery"><div class="level"></div></div>'
      )
      $('.battery .level').width(value + '%')
      if (value < 20) {
        $('.battery .level').css({
          background: '#993333'
        })
      } else if ( value < 40) {
        $('.battery .level').css({
          background: '#996633'
        })
      } else {
        $('.battery .level').css({
          background: '#333'
        })
      }
    })

    function chart(domain, interpolation, tick, lorr) {
        var data = [d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random )];

        var margin = {
                top: -60,
                right: 0,
                bottom: 0,
                left: 25
            },
            width = window.innerWidth / 2 - 100 ,
            height = window.innerHeight - 100;

        var x = d3.scale.linear()
            .domain( domain )
            .range( [0, width] );

        var y = d3.scale.linear()
            .domain( [0, .7] )
            .range( [height, 0] );

        var line = d3.svg.line()
            .interpolate( interpolation )
            .x( function(d, i) {
                return x( i );
            } )
            .y( function(d) {
                return y( d );
            } );

        var svg = d3.select( "body" ).append( "p" ).append( "svg" )
            .attr( "width", width + margin.left + margin.right )
            .attr( "height", height + margin.top + margin.bottom )
            .style( "margin-left", margin.left + "px" )
            .style( "margin-top", margin.top + "px" )
            .style({
                position: 'absolute',
                left: 0 + (lorr==='r'?window.innerWidth/2:0),
                top: 0
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
            //.data(data)
            .attr( "class", "line" )
            .style( "stroke", function(d, i) {
                return colors[i];
            } )
            .style( "stroke-width", 30)
            .style( "stroke-opacity", .5)
            .attr( "d", line )
        

        // tick(path, line, data, x);
        
        var add_point = function(what,where){
          
          var xVal = (new Date()).getTime(), // current time
              yVal = what;
          data[where].push( what );
                      path
                          .attr( "d", line )
                          .attr( "transform", null )
          
                      // pop the old data point off the front
                      data[where].shift();
        }
        socket.on( lorr, function(value) {

              
            // if(value.address == "/muse/elements/experimental/concentration"){
            //   add_point(value.args[0],0)
            // }
            // if(value.address == "/muse/elements/experimental/mellow"){
            //   add_point(value.args[0],1)
            // }
            add_point(value[1]>.4?.4:(value[1]<.10?.10:value[1]),value[0])
            if (!w.last){
                w.last = {l:[],r:[]}
            }
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

                 // 3 1 0 2 4
                 // Delta Theta Alpha Beta Gamma
                 // Delta 3
                 // Theta 1
                 // Alpha 0
                 // Beta 2
                 // Gamma 4
                 var b = notes[i];
                 w[lorr] = b






                 var phrases = [
                         'relaxed',
                         'tripping balls',
                         'focused externally',
                         'ADHD',
                         'stressing big time'
                     ]
                 if (lorr == 'l'){
                    w.last_l = i
                 } else {
                    w.last_r = i
                 }
                 if (w.last_l === w.last_r) {
                    $('#ur').html(
                        '<div>You are ' + phrases[w.last_l] + '.</div>')
                 } else {
                    $('#ur').html(
                        '<div style="width:50%;">Your left brain is ' + phrases[w.last_l] + '.</div>'
                        + '<div style="width:50%;">Your right brain is ' + phrases[w.last_r] + '.</div>'
                    )
                 }
                 
               }
            })

            // if(value.address == "/muse/elements/alpha_absolute"){
            //   var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
            //   // add_point((avg - last.theta + 1)/2,1)
            //   add_point(avg,2)
            //   // last.alpha = avg
            // }
            // if(value.address == "/muse/elements/theta_absolute"){
            //   var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
            //   // add_point((last.alpha - avg + 1)/2,1)
            //   add_point(avg,3)
            //   // last.theta = avg
            // }
            // if(value.address == "/muse/elements/gamma_absolute"){
            //   var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
            //   // add_point((last.alpha - avg + 1)/2,1)
            //   add_point(avg,0)
            //   // last.theta = avg
            // }
        } );
    }

    chart( [1, n - 2], "none", function tick(path, line, data, x) {}, 'l' );
    chart( [1, n - 2], "none", function tick(path, line, data, x) {}, 'r' );

} );

