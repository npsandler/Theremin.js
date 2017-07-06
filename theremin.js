

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
    canvasCtx.clearRect(0, 0, 1200, 600);
    debugger
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
  analyser.fftSize = 8192;
  analyser.smoothingTimeConstant = 0;

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  let processer = theremin.createScriptProcessor(2048, 1, 1);
  processer.connect(theremin.destination)

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

    canvasCtx.clearRect(0, 0, 1200, 600);
    canvasCtx.fillStyle=gradient;
    drawSpectrum(freqArray);

  };

   function drawSpectrum(array) {
   for ( let i = 0; i < (array.length); i++ ){
           let barHeight = array[i] * 2.5;
           canvasCtx.fillRect(i*5, (650-barHeight), 4, barHeight);
   }
 }


});
