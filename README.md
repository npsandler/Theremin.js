## JS Project Proposal: Theramin

### Background

Theramin is an interactive music app built entirely in JavaScript. Users can alter the pitch and volume of the theramin by sliding their mouse around the screen much like a real theramin. They also can toggle options like waveform shape and filters like delay and feedback.

### Functionality & MVPs

With this app, users will be able to:

 Click and drag to dynamically alter the pitch and volume of the theramin
 Toggle between different opptions of waveform shapes
 Draggable sliders to effect different filters and how much they impact the sound

In addition, this project will include:

 An About modal describing the background and rules of the game
 A production README

### Wireframe

This app will consist of a single screen with an input area, waveform controls, and filter sliders. It will also include a link to my Github, LinkedIn, and the About modal. Game controls will include Start, Stop, and Reset buttons as well as a slider to control the speed. On top, it will have a toggle with optionfs for the waveform shapes. On the bottom, there will be two (or more) sliders to add/subtract the different filter effects.


![wireframe](https://github.com/npsandler/Theramin.js/blob/master/Theramin.png)



### Architecture and Technologies

This project will be implemented with the following technologies:

JavaScript for game logic,
Web Audio API for the audio


### Implementation Timeline

Day 1: Setup all necessary Node modules, including getting webpack up and running and Web Audio installed. Write a basic entry file. Learn the basics of Web Audio

Day 2: Build out the basic structure of the app interface including the visualization area, top toggles, and bottom sliders

Day 3: Connect the visualization area to Web Audio with as listener so that the pitch can be created and dynamically changed. Add Functionality to waveform toggles.

Day 4: Install the controls for the user to interact pitch via filters. Style the frontend, making it polished and professional.
