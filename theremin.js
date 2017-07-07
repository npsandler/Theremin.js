

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

  //set up defaults, connect effects to oscillator
  osc.type = 'sine';
  osc.connect(gain);
  osc.connect(delay);

  gain.gain.value = 0;


  gain.connect(theremin.destination);

  osc.connect(analyser);
  osc.start();

  let active = false;
  let volume = 0;
  let freq = 0;

  //    feedback = ctx.createGain();
  //    feedback.gain.value = 0.8;
  //
  //    filter = ctx.createBiquadFilter();
  //    filter.frequency.value = 1000;
  //
  //    delay.connect(feedback);
  //    feedback.connect(filter);
  //    filter.connect(delay);
  //
  //    source.connect(delay);
  //    source.connect(ctx.destination);
  //    delay.connect(ctx.destination);
  //
  //  var controls = $("div#sliders");
  //
  //  controls.find("input[name='delayTime']").on('input', function() {
  //    delay.delayTime.value = $(this).val();
  //  });
  //
  //  controls.find("input[name='feedback']").on('input', function() {
  //    feedback.gain.value = $(this).val();
  //  });
  //
  //  controls.find("input[name='frequency']").on('input', function() {
  //    filter.frequency.value = $(this).val();
  //  });







  //
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
    volume = 1.3 - (((e.clientY)/height*100)/100);
    freq = 500-1000*(1-((e.clientX)/width))+ 5;
    delay.delayTime.value = 0.3;
    delay.connect(theremin.destination);
    debugger
    osc.frequency.value = freq;
    gain.gain.value = volume;
  }

  function drag(e){
    e.preventDefault();
    if (active) {
      volume = 1.3 - (((e.clientY)/height*100)/100);
      freq = 500-1000*(1-((e.clientX)/width))+ 5;
      delay.delayTime.value = 0.3;
      delay.connect(theremin.destination);
      osc.frequency.value = freq;
      gain.gain.value = volume;
    }
  }

  function release(e){
    active = false;
    debugger
    theremin.disconnect(delay);
    gain.gain.value = 0;
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
  let sliders = document.getElementsByClassName('slider');
  for (i=0; i < sliders.length; i++){
    sliders[i].addEventListener('change',function(){
    });
  }
  //update slider vals
  function updateVal(val) {
    document.getElementById('textInput').value=val;
  }



  // visualization
  analyser.fftSize = 8192;
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
      gradient.addColorStop(1,'#fff952');
      gradient.addColorStop(0.9,'#ffcd51');
      gradient.addColorStop(0.7,'#ff8251');
      gradient.addColorStop(0.1,'#f42424');

    let freqArray =  new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(freqArray);


    canvasCtx.clearRect(0, 0, 1200, 650);
    canvasCtx.fillStyle=gradient;
    drawSpectrum(freqArray);

  };

  function drawSpectrum(array) {
    for ( let i = 0; i < (array.length); i++ ){
     let barHeight = array[i] * 2.6;
     canvasCtx.fillRect(i*8, (650-barHeight), 6, barHeight);
   }
  }


});
