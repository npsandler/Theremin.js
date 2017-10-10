# [Theremin.js](http://npsandler.com/Theremin.js/)

Theremin.js a music creation and visualization app built entirely using JavaScript, HTML, and CSS.

![theremin](https://github.com/npsandler/Theremin.js/blob/master/docs/app.png)

### Generating Sounds

Users create sound using a simple X and Y-axis input, similar to a real theremin. This was achieved by translating the mouse's X-Y coordinates on the canvas into an appropriate volume and frequency value for a Web Audio API `oscillatorNode`.

![handleSound](https://github.com/npsandler/Theremin.js/blob/master/docs/handleSound.png)


### Changing Wave Shapes

Users have the ability to switch between three common types of audio waves; sine, square, triangle and sawtooth. Each button has a click listener which, when fired, assigns the appropriate wave shape to the variable `waveShape`, which is assigned to the oscillatorNode once created.

![waveShape_assignment](https://github.com/npsandler/Theremin.js/blob/master/docs/waveShape_assignment.png)

### Applying Filters

In addition to having the ability to control the wave shape, users have a variety of sounds effects they are able to apply to the theremin

![filters](https://github.com/npsandler/Theremin.js/blob/master/docs/filters.png)

Each input listens for change, and either reassigns the appropriate value (in the case of sliders) or toggles the effect to be either on or off (in the case of the switches).

![input_change](https://github.com/npsandler/Theremin.js/blob/master/docs/input_change.png)

### Visualization

The visualization component of app was implemented again using Web Audio API and also Canvas.

![visualization](https://github.com/npsandler/Theremin.js/blob/master/docs/visualization.png)

I implemented a Web Audio `ScriptProcessorNode`, which allowed me to continuously call the helper method `drawSpectrum` while the oscillator is activated by the user. Using Canvas, drawSpectrum iterates through an array of frequencies and draws a corresponding bar onto the canvas for the visualization.
