var rbvj;

// add drawing canvases
var ctx = createCanvas( 'canvas1' );

var renderer = new THREE.WebGLRenderer( {
  alpha: true,
  antialias: true
} );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
renderer.localClippingEnabled = true;
document.getElementById( "canvas3D" )
  .appendChild( renderer.domElement );

var balls_count = 10;
var balls_vol = 10;

const id = "-451992432";
var globalMidiAccess = null;
var globalMidiInput = null;

function onMIDIChange(event) {
  console.log('onMIDIChange', event);
}

function onMIDIMessage(event) {
  // console.log('onMIDIMessage', event);
  const { data } = event;
  console.log(data)
  var command = data[0];
  var note = data[1];
  var velocity = data[2] || 0;
console.log('velocity', velocity)
  //
  console.log(note === 10, note === 74)
  if(note === 10) {
    balls_count = velocity;
  } else if(note = 74) {
    balls_vol = velocity;
  }
}

function onMIDISuccess(midiAccess) {
  console.log(midiAccess)
  midiAccess.onstatechange = onMIDIChange;
  const midiInputPorts = new Array(...midiAccess.inputs.values());
  console.log('midiInputPorts')
  console.log(midiInputPorts)

  globalMidiInput = midiInputPorts.find(midiPort => {
    return midiPort.type === 'input' && midiPort.name === "Arturia BeatStep";
  });

  if(globalMidiInput) {
    // We close the old port
    // if (this.state.selectedMidiInputPort && this.state.selectedMidiInputPort.id !== selectedMidiInputPort.id) {
      // this.state.selectedMidiInputPort.close();
    // }
    globalMidiInput.onmidimessage = onMIDIMessage;
    globalMidiInput.open();
  }

  const midiOutputPorts = new Array(...midiAccess.outputs.values());
  console.log('midiOutputPorts')
  console.log(midiOutputPorts)
  globalMidiAccess = midiAccess
  // this.setState({
  //   midiAccess: midiAccess,
  //   midiInputPorts: midiInputPorts,
  //   midiOutputPorts: midiOutputPorts
  // });
}

if(navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess()
  .then(onMIDISuccess)
}



rbvj = function () {

  var block_size = 20;
  var maxballs = 500;
  var balls = [];
  var motion = [];
  var gridx = 20;
  var gridy = 5;
  // var number_of_balls = gridx * gridy;
  var number_of_balls = balls_count;
  var grid = createGrid( gridx, gridy );
  var grid2 = createGrid( gridx * 2, gridy * 2 );

  for ( var i = 0; i < number_of_balls; i++ ) {
    addBall( grid[ i ].x, grid[ i ].y );
  }

  ctx.background( 0 );


  function addBall( _x = random(10, 1000), _y = random(10, 100) ) {
    var sz = ave( random( 20, 200 ), gridx * 2 );
console.log(_x, _y)
    var ball = {
      x: _x,
      y: _y,
      speed_x: random( -2, 2 ),
      speed_y: random( -5, -1 ),
      c: rgba( 255 ),
      sz: sz
    }

    balls.push( ball );
    if ( balls.length > maxballs ) removeBall();

  }

  function removeBall() {
    balls.splice( 0, 1 );
  }

  for ( var i = 0; i < number_of_balls; i++ ) {
    addBall( grid[ i ].x, grid[ i ].y );
  }

  function update() {

    if(balls.length < balls_count) {
      console.log('addin', balls.length, balls_count)
      addBall();
    } else if(balls.length > balls_count) {
      console.log('remove', balls.length, balls_count)
      removeBall();
    }
    // console.log('ball length', balls.length)
    
    for ( var i = 0; i < balls.length; i++ ) {

      b = balls[ i ];

      if ( b.x > width - b.size / 2 || b.x < b.size / 2 ) {
        b.speed_x = b.speed_x * -1;
      }

      if ( b.y < 0 ) {
        b.y = height;
      }
      // vol = Sound.mapSound( i, balls.length, 0, 10 );
      // vol = 10;
      vol = balls_vol;
      //b.x += b.speed_x;
      b.y += b.speed_y - vol / 10;

      b.sz = Math.abs( Math.sin( frameCount / ( 20 + i + vol ) ) * 50 );
    } // end for loop

  }


  draw = function () {

    ctx.background( 255, 0.4 );
    update();

    ctx.lineWidth = 4;
    ctx.strokeStyle = rgb( 255 );
    for ( var i = 0; i < balls.length; i++ ) {
      b = balls[ i ];
      ctx.fillStyle = rgb( 0 );
      ctx.fillEllipse( b.x, b.y, b.sz, b.sz );

    } // end for loop

    ctx.lineWidth = 0.2;
    ctx.strokeStyle = rgba( 220, 0.9 );

  } // end draw

}();
