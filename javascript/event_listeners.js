
// setting up variables
let delaySlider, feedbackSlider, distortionToggle, reverbToggle;

let waveShape = "sine";
let delayVal = 0.3;
let feedbackVal = 0.4;

document.addEventListener("DOMContentLoaded", function(event) {


  // Mouse events
  window.canvas.addEventListener('mousedown', (e) => {
    capture(e);
  });

  window.canvas.addEventListener('mousemove',(e) => {
    drag(e);
  });

  window.canvas.addEventListener('mouseup', (e) => {
    release(e);
  });

  window.canvas.addEventListener('mouseleave', (e) => {
    release(e);
  })

  //sound wave buttons
  let waveShapes = document.getElementsByClassName('oscType');

  for (i=0; i < waveShapes.length; i++){
    waveShapes[i].addEventListener('click',function(){
      revertColors();
      waveShape = this.id;
      this.style.background = "#52489C"
    });
  }

  function revertColors() {
    for (i=0; i < waveShapes.length; i++){
      waveShapes[i].style.background = "#ff5c5c";
    }
  }

  // effect sliders
  delaySlider = document.getElementById('delayInput');
  feedbackSlider = document.getElementById('feedbackInput');
  distortionToggle = document.getElementById('distortionInput');
  reverbToggle = document.getElementById('reverbInput');


  //add change listeners
  delaySlider.addEventListener("change", function() {
    delayVal = this.value/100;
  });

  feedbackSlider.addEventListener("change", function() {
    feedbackVal = this.value/200;
  });

  distortionToggle.addEventListener("change", function() {
    if (distortion.curve) {
      distortion.curve = undefined;
    } else {
        distortion.curve = window.makeDistortionCurve(150);
      }
  });

  reverbToggle.addEventListener("change", function() {
    if (reverb.buffer) {
      sourceNode.buffer = undefined;
    } else {
      let request = new XMLHttpRequest();
      request.open("GET", "https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg", true);
      request.responseType = "arraybuffer";
      console.log(request);
      request.onreadyStateChange = function () {
         context.decodeAudioData(request.response, function(buffer) {
            sourceNode.buffer = buffer;
         }, function(e){console.log("Error with decoding audio data" + e.err)});
       };
    }
    console.log(reverb);
    console.log(sourceNode);
  });



});

// default values
let active = false;
volume = 0;
let freq = 0;

// methods mouse events
function capture(e){
  e.preventDefault();
  active = true;

  osc = theremin.createOscillator();
  osc.type = waveShape;

  osc.connect(gain);
  osc.connect(delay);
  osc.connect(reverb);
  osc.connect(distortion);
  osc.connect(analyser);

  osc.start();

  handleSound(e);
}

function drag(e){
  e.preventDefault();
  if (active) {
    handleSound(e);
  }
}


function handleSound(e) {
  let width = window.canvas.offsetWidth;
  let height = window.canvas.offsetHeight;

  volume = 0.8 - (((e.clientY)/height*100)/100);
  freq = 500-1000*(1-((e.clientX)/width))+ 5;

  osc.frequency.value = freq;
  gain.gain.value = volume;

  reverb.normalize = false;

  osc.connect(theremin.destination);
  delay.connect(theremin.destination);
  reverb.connect(theremin.destination);

  delay.delayTime.value = delayVal;
  delay.connect(theremin.destination);

  delayFeedback.gain.value = feedbackVal;
  filter.frequency.value = 500;
  delay.connect(delayFeedback);
  delayFeedback.connect(filter);
  filter.connect(delay);

}

function release(e){
  active = false;
  gain.gain.value = 0;
  osc.stop();
}

function resetFilters(e){
  waveShape = "sine";
  delayVal = 0.3;
  feedbackVal = 0.4;
}
