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

document.addEventListener('mousedown', function(e){capture(e)});
document.addEventListener('mousemove',function(e){drag(e)});
document.addEventListener('mouseup',function(e){release(e)});

// Start the Note
function capture(e){
  e.preventDefault();
  active = true;
  volume = ~~((e.clientX||e.touches[0].clientX)/window.innerWidth*100)/100;
  freq = ~~(1000*(1-((e.clientY||e.touches[0].clientY)/window.innerHeight)));
  osc.frequency.value = freq;
  gain.gain.value = volume;
  output.innerHTML = 'Frequency = '+freq+'hz, Volume = '+~~(volume*100)+'%';
}
// Update the properties of the note
function drag(e){
  e.preventDefault()
  if (active) {
    volume = ~~((e.clientX||e.touches[0].clientX)/window.innerWidth*100)/100;
    freq = ~~(1000*(1-((e.clientY||e.touches[0].clientY)/window.innerHeight)));
    osc.frequency.value = freq;
    gain.gain.value = volume;
    output.innerHTML = 'Frequency = '+freq+'hz, Volume = '+~~(volume*100)+'%';
  }
}
// Release The Note
function release(e){
  active = false;
  gain.gain.value = 0;
  // output.innerHTML = '';
}
// Make UI buttons control type
var button = document.getElementsByTagName('input');
for (i=0;i<button.length;i++){
  button[i].addEventListener('click',function(){switchType(this.value)});
  button[i].addEventListener('touchstart',function(){switchType(this.value)});
}
function switchType(type){
  osc.type = type;
}
