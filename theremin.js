

document.addEventListener("DOMContentLoaded", function(event) {


  let canvas = document.getElementById('canvas');
  let canvasCtx = canvas.getContext('2d');
  let output = document.getElementById('output');



  let theremin = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = theremin.createAnalyser();

  let osc = theremin.createOscillator();
  let gain = theremin.createGain();

  osc.type = 'sine';
  osc.connect(gain);
  gain.gain.value = 0;
  gain.connect(theremin.destination);
  osc.connect(analyser);
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

  let waveShapes = document.getElementsByClassName('oscType');

  for (i=0;i<waveShapes.length;i++){
    waveShapes[i].addEventListener('click',function(){
      changeWaveShape(this.id);
    });
  }

  function changeWaveShape(type){
    osc.type = type;
  }



// visualization
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0;

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  let processer = theremin.createScriptProcessor(2048, 1, 1);
  processer.connect(theremin.destination)

 let sourceNode = theremin.createBufferSource();
 sourceNode.connect(analyser);
 analyser.connect(processer);

  // sourceNode.connect(theremin.destination);

  processer.onaudioprocess = function() {
    let gradient = canvasCtx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(1,'#fff952');
      gradient.addColorStop(0.75,'#fff952');
      gradient.addColorStop(0.25,'#fff952');
      gradient.addColorStop(0,'#fff952');

    let freqArray =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqArray);
    let average = getAverageVolume(freqArray);

    canvasCtx.clearRect(0, 0, 1700, 600);
    canvasCtx.fillStyle=gradient;
    drawSpectrum(freqArray);

  };

   function drawSpectrum(array) {
   for ( let i = 0; i < (array.length); i++ ){
           let value = array[i];
           canvasCtx.fillRect(i*5,600-value,4,600);
       }
   }

  function getAverageVolume(array) {
    let values = 0;

    let length = array.length;

    for (let i = 0; i < length; i++) {
        values += array[i];
    }
    const average = values / length;
    return average;
  }

});
