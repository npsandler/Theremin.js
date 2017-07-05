

document.addEventListener("DOMContentLoaded", function(event) {


  let canvas = document.getElementById('canvas');
  let output = document.getElementById('output');



  let synth = new (window.AudioContext)();
  let osc = synth.createOscillator();
  let gain = synth.createGain();

  osc.type = 'sine';
  osc.connect(gain);
  gain.gain.value = 0;
  gain.connect(synth.destination);
  osc.start();

  let active = false;
  let volume = 0;
  let freq = 0;


  canvas.addEventListener('mousedown', (e) => {
    capture(e);
  });

  canvas.addEventListener('mousemove',(e) => {
    drag(e);
  });

  canvas.addEventListener('mouseup', (e) => {
    release(e);
  });

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  function capture(e){
    e.preventDefault();
    active = true;
    volume = ~~((e.clientX||e.touches[0].clientX)/width*100)/100;
    freq = ~~(1000*(1-((e.clientY||e.touches[0].clientY)/height)));
    osc.frequency.value = freq;
    gain.gain.value = volume;
  }

  function drag(e){
    e.preventDefault();
    if (active) {
      volume = ~~((e.clientY)/width*100)/100;
      freq = ~~(1000*(1-((e.clientX)/height))+ 5);
      osc.frequency.value = freq;
      gain.gain.value = volume;
    }
  }

  function release(e){
    active = false;
    gain.gain.value = 0;
  }

  let waveShapes = document.getElementsByClassName('shape');

  for (i=0;i<waveShapes.length;i++){
    waveShapes[i].addEventListener('click',function(){
      changeWaveShape(this.id);
    });
  }

  function changeWaveShape(type){
    osc.type = type;
  }


});
