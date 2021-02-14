
const id = "-451992432";
var globalMidiAccess = null;
var globalMidiInput = null;

let cc = [];
let notes = () => {};

var ready = new Promise((resolve, reject) => {

  function onMIDIChange(event) {
    console.log('onMIDIChange', event);
  }
  
  function onMIDIMessage(event) {
    const { data } = event;
    var command = data[0];
    var note = data[1];
    var velocity = data[2] || 0;
console.log(data)
    if (command = 174) {
      const s = cc[note] || (() => {});
      s(velocity)
    } else {
      notes(note, velocity)
    }
  // console.log('velocity', velocity)
  //   //
  //   console.log(note === 10, note === 74)
  //   if(note === 10) {
  //     balls_count = velocity;
  //   } else if(note = 74) {
  //     balls_vol = velocity;
  //   }
  }
  
  function onMIDISuccess(midiAccess) {
    globalMidiAccess = midiAccess;
  
    midiAccess.onstatechange = onMIDIChange;
  
    const midiInputPorts = new Array(...midiAccess.inputs.values());
  
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
      resolve();
    }
  
    // const midiOutputPorts = new Array(...midiAccess.outputs.values());
  }
  
  if(navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
    .then(onMIDISuccess);
  } else {
    reject();
  }
});



globalThis.BeatStep = {
  ready,
  // cc: (ccid, callback) => {

  // }
  cc,
  notes
};
