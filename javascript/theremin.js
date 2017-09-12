

let canvas, canvasCtx, theremin, gain, delay, reverb, distortion, analyser, delayFeedback, filter, sourceNode, volume;

document.addEventListener("DOMContentLoaded", function(event) {


  canvas = document.getElementById('canvas');
  canvasCtx = canvas.getContext('2d');


  //create AudioContext elements
  theremin = new (window.AudioContext || window.webkitAudioContext)();
  analyser = theremin.createAnalyser();
  analyser.smoothingTimeConstant = 0.85;

  //for visualization
  let HEIGHT = canvasCtx.canvas.clientHeight;
  let WIDTH = canvasCtx.canvas.clientWidth;
  let osc;
  let waveShape = "sine";

  // set up nodes and connect
  gain = theremin.createGain();
  delay = theremin.createDelay();
  distortion = theremin.createWaveShaper();
  filter = theremin.createBiquadFilter();
  delayFeedback = theremin.createGain();
  reverb = theremin.createConvolver();

  let distortionFilter = theremin.createBiquadFilter();
  let distortionMax = theremin.createGain(0.5);


  distortionFilter.type = 'lowpass';
  distortionFilter.connect(distortion);
  distortionMax.connect(distortion);
  distortion.connect(gain);

  filter.connect(reverb);
  reverb.connect(gain);

  gain.gain.value = 0;
  gain.connect(theremin.destination);




  // visualization
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0;

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  let processer = theremin.createScriptProcessor(2048, 1, 1);
  processer.connect(theremin.destination);

  sourceNode = theremin.createBufferSource();
  sourceNode.connect(analyser);
  analyser.connect(processer);


  processer.onaudioprocess = function() {
    let gradient = canvasCtx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(1,'#52489C');

    let freqArray =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqArray);
    canvasCtx.clearRect(0, 0, HEIGHT, WIDTH);
    canvasCtx.fillStyle = gradient;
    window.drawSpectrum(freqArray);
  };

  window.drawSpectrum = function(array) {
     let barHeight;
     let x = 0;
     let barWidth = (WIDTH / bufferLength) * 5;
     for(var i = 0; i < bufferLength; i++) {
       barHeight = ((array[i]-10) * -3 * (volume)) - 50;
       if (barHeight > -50 ) {
         barHeight = -50;
       }
       canvasCtx.fillRect(x,HEIGHT/2,barWidth,barHeight/3 - 10);

       x += barWidth + 1;
     }
  };


});
