

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
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.clearRect(0, 0, 1700, 600);

  function draw() {
    drawVisual = requestAnimationFrame(draw);
    
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = '#ff5c5c';
    canvasCtx.fillRect(0, 0, 1700, 600);

    let barWidth = (1700 / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]*2;

        canvasCtx.fillStyle = '#fff952';
        canvasCtx.fillRect(x,600-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
      }
    };

    draw();
});
