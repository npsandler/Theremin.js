
var synth = new (window.AudioContext || window.webkitAudioContext )();
var osc = synth.createOscillator();
var gain = synth.createGain();
var output = document.getElementById('output');
osc.type = 'sine';
osc.connect(gain);
gain.gain.value = 0;
gain.connect(synth.destination);
osc.start();

var active = false;
var volume = 0;
var freq = 0;

var canvas = document.getElementById('canvas');
debugger
canvas.addEventListener('mousedown', function(e){capture(e)});
canvas.addEventListener('mousemove',function(e){drag(e)});
canvas.addEventListener('mouseup',function(e){release(e)});

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
  e.preventDefault()
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

// var button = document.getElementsByTagName('input');
// for (i=0;i<button.length;i++){
//   button[i].addEventListener('click',function(){switchType(this.value)});
//   button[i].addEventListener('touchstart',function(){switchType(this.value)});
// }
// function switchType(type){
//   osc.type = type;
// }
