

// distortion algorithm --
window.makeDistortionCurve = function(amount) {
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
}
