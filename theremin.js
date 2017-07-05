

document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.getElementById('canvas');
  var output = document.getElementById('output');




  var synth = new (window.AudioContext)();
  var osc = synth.createOscillator();
  var gain = synth.createGain();

  osc.type = 'sine';
  osc.connect(gain);
  gain.gain.value = 0;
  gain.connect(synth.destination);
  osc.start();

  var active = false;
  var volume = 0;
  var freq = 0;


  canvas.addEventListener('mousedown', (e) => {
    capture(e);
  });

  canvas.addEventListener('mousemove',(e) => {
    drag(e);
  });

  canvas.addEventListener('mouseup', (e) => {
    release(e);
  });

  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight
  function capture(e){
    e.preventDefault();
    active = true;
    volume = ~~((e.clientX||e.touches[0].clientX)/width*100)/100;
    freq = ~~(1000*(1-((e.clientY||e.touches[0].clientY)/height)));
    osc.frequency.value = freq;
    gain.gain.value = volume;
    // output.innerHTML = 'Frequency = '+freq+'hz, Volume = '+~~(volume*100)+'%';
  }

  function drag(e){
    e.preventDefault();
    if (active) {
      volume = ~~((e.clientX||e.touches[0].clientX)/width*100)/100;
      freq = ~~(1000*(1-((e.clientY||e.touches[0].clientY)/height)));
      osc.frequency.value = freq;
      gain.gain.value = volume;
      // output.innerHTML = 'Frequency = '+freq+'hz, Volume = '+~~(volume*100)+'%';
    }
  }

  function release(e){
    active = false;
    gain.gain.value = 0;
    // output.innerHTML = '';
  }

  var waveShapes = document.getElementsByTagName('input');
  const buttons = Array.from(waveShapes);
  buttons.forEach( waveShape => {
    debugger
      waveShape.addEventListener('click',() => {
        debugger
        changeWaveShape(this.data);
      });
    });

  function changeWaveShape(type){
    osc.type = type;
  }


});
