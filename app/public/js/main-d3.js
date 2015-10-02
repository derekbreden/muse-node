$( function() {

    var n = 240,
        random = d3.random.normal( 0, 0 );

    function chart(domain, interpolation, tick) {
        var data = [d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random ),d3.range( n ).map( random )];

        var margin = {
                top: 10,
                right: 0,
                bottom: 6,
                left: 80
            },
            width = window.innerWidth - 200,
            height = window.innerHeight - 40;

        var x = d3.scale.linear()
            .domain( domain )
            .range( [0, width] );

        var y = d3.scale.linear()
            .domain( [0, .75] )
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

        svg.append( "g" )
            .attr( "class", "y axis" )
            .call( d3.svg.axis().scale( y ).ticks( 5 ).orient( "left" ) )
            .append( "text" )
            .attr( "transform", "rotate(-90)" )
            .attr( "y", 6 )
            .attr( "dy", ".71em" )
            .style( "text-anchor", "end" )
            .text( "" );

        var colors = ["red", "#92278F", "#0071BB", "#00A651"];

        var path = aLineContainer
            .attr( "clip-path", "url(#clip)" )
            .append( "path" )
            //.data(data)
            .attr( "class", "line" )
            .style( "stroke", function(d, i) {
                return colors[i];
            } )
            .attr( "d", line );

        // tick(path, line, data, x);
        
        var add_point = function(what,where){
          
          var xVal = (new Date()).getTime(), // current time
              yVal = what;
          data[where].push( what );
                      path
                          .attr( "d", line )
                          .attr( "transform", null )
                          .transition()
                          .duration( 750 )
                          .ease( "linear" )
                          .attr( "transform", "translate(" + x( 0 ) + ")" );

                      // pop the old data point off the front
                      data[where].shift();
                    last[where] = what
        }
                    
        var socket = io.connect( "http://localhost:3000" );
        var last = [0,0,0,0]
        losing = true
        winning = false
        l_s = 0
        w_s = 0
        last_change = new Date()
        socket.on( "news", function(value) {
            if(!(value.args))
              return;
              
            // if(value.address == "/muse/elements/experimental/concentration"){
            //   add_point(value.args[0],0)
            // }
            // if(value.address == "/muse/elements/experimental/mellow"){
            //   add_point(value.args[0],1)
            // }
            if(value.address == "/muse/elements/alpha_relative"){
              var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
              add_point(avg,0)
              if(avg > last[1] && avg > last[2] && avg > last[3]){
                w_s += (new Date() - last_change)/1000
                document.getElementById('winning').innerHTML = Math.round(w_s)
                document.body.className = 'winning'
              }else{
                l_s += (new Date() - last_change)/1000
                document.getElementById('losing').innerHTML = Math.round(l_s)
                document.body.className = 'losing'
              }
              last_change = new Date()
            }
            if(value.address == "/muse/elements/beta_relative"){
              var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
              add_point(avg,1)
            }
            if(value.address == "/muse/elements/gamma_relative"){
              var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
              add_point(avg,2)
            }
            if(value.address == "/muse/elements/delta_relative"){
              var avg = (value.args[0]+value.args[1]+value.args[2]+value.args[3]) / 4
              add_point(avg,3)
            }
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

    chart( [1, n - 2], "basis", function tick(path, line, data, x) {} );

} );
