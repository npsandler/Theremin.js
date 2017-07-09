

document.addEventListener("DOMContentLoaded", function(event) {


  let canvas = document.getElementById('canvas');
  let canvasCtx = canvas.getContext('2d');
  let output = document.getElementById('output');


  //create AudioContext elements
  let theremin = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = theremin.createAnalyser();

  let osc = theremin.createOscillator();
  let gain = theremin.createGain();


  let delay = theremin.createDelay();
  let distortion = theremin.createWaveShaper();
  let distortionFilter = theremin.createBiquadFilter();
  let distortionMax = theremin.createGain(0.5);
  let filter = theremin.createBiquadFilter();
  let delayFeedback = theremin.createGain();
  let reverb = theremin.createConvolver();

  //set up defaults, connect effects to oscillator
  osc.type = 'triangle';
  osc.connect(gain);
  osc.connect(delay);
  // osc.connect(reverb);
  osc.connect(distortion);

  distortionFilter.type = 'lowpass';
  distortionFilter.connect(distortion);
  distortionMax.connect(distortion);
  distortion.connect(gain);

  gain.gain.value = 0;


  filter.connect(reverb);
  reverb.connect(gain);
  gain.connect(theremin.destination);


  osc.connect(analyser);
  osc.start();

  let active = false;
  let volume = 0;
  let freq = 0;
  reverb.buffer = theremin.createBuffer(1, 44100, theremin.sampleRate);

  // Mouse event handling
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
    handleSound(e);
  }

  function drag(e){
    e.preventDefault();
    if (active) {
      handleSound(e);
    }
  }

  function handleSound(e) {
    volume = 1.3 - (((e.clientY)/height*100)/100);
    freq = 500-1000*(1-((e.clientX)/width))+ 5;

    osc.frequency.value = freq;
    gain.gain.value = volume;

    delay.delayTime.value = delayVal;
    delay.connect(theremin.destination);

    delayFeedback.gain.value = feedbackVal;
    filter.frequency.value = 500;
    delay.connect(delayFeedback);
    delayFeedback.connect(filter);
    filter.connect(delay);

    osc.connect(theremin.destination);
    delay.connect(theremin.destination);
  }

  function release(e){
    active = false;
    gain.gain.value = 0;
    osc.frequency.value = 0;


    canvasCtx.clearRect(0, 0, 1200, 650);
  }


  //sound wave buttons
  let waveShapes = document.getElementsByClassName('oscType');

  for (i=0; i < waveShapes.length; i++){
    waveShapes[i].addEventListener('click',function(){
      osc.type = this.id;
    });
  }

  // effect sliders
  let delaySlider = document.getElementById('delayInput');
  let feedbackSlider = document.getElementById('feedbackInput');
  let distortionSlider = document.getElementById('distortionInput');
  let reverbSlider = document.getElementById('reverbInput');
  let delayVal = 0.3;
  let feedbackVal = 0.4;
  let distorionVal = 0;

  //update slider vals
  delaySlider.addEventListener("change", function() {
    delayVal = this.value/100;
  });

  feedbackSlider.addEventListener("change", function() {
    feedbackVal = this.value/200;
  });

  distortionSlider.addEventListener("change", function() {
    distortion.curve = makeDistortionCurve(this.value);
  });




  // distortion algorithm --
  function makeDistortionCurve(amount) {
      let dist = amount * 1.5;
      let n_samples = 44100;
      let curve = new Float32Array(n_samples);
      let deg = Math.PI / 180;
      let i = 0;
      let x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + dist ) * x * 20 * deg / ( Math.PI + dist * Math.abs(x) );
    }
    return curve;
  };



  // visualization
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0;

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  let processer = theremin.createScriptProcessor(2048, 1, 1);
  processer.connect(theremin.destination);

  let sourceNode = theremin.createBufferSource();
  sourceNode.connect(analyser);
  analyser.connect(processer);


  processer.onaudioprocess = function() {
    let gradient = canvasCtx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(1,'#52489C');
      gradient.addColorStop(0.7,'#3C3572');
      gradient.addColorStop(0.5,'#262147');
      gradient.addColorStop(0.1,'#17142B');

    let freqArray =  new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(freqArray);


    canvasCtx.clearRect(0, 0, 1200, 650);
    canvasCtx.fillStyle=gradient;
    drawSpectrum(freqArray);
  };

  function drawSpectrum(array) {
    for ( let i = 0; i < (array.length); i++ ){
     let barHeight = array[i] * -2.6;
     canvasCtx.fillRect(i*20, 650, 18, barHeight+25);
   }
  }


});
