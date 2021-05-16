# Guess-What-You-Draw
This project is about a Computer Vision term project.

## Model
[Guess What You Draw ( Doodles Image Classifier )](https://github.com/ThreeTeaTree/Guess-What-You-Draw-Doodles-Classifier)

## Problem Statement: 
### Describe what problem you want to solve.
* From covid-19 lockdown, we all need to stay in our home for safety. During self isolation, it is for sure that the stress will increase more and more. We intend to help reduce stress by creating a multiplayer game that lets you play with your friends with easy drawing to keep you in touch with your friend even though you are far away from each other.
### What's the input/output?
* input is Drawing from user
* output is Class label which have [50 classes](https://github.com/ThreeTeaTree/Guess-What-You-Draw-Doodles-Classifier/blob/main/doodleDataset/50classList.txt) refer to github in Model section
### Why is it important or interesting?
* Because it can help people to play with their friends and reduce their stress during covid-19 lockdown which we cannot go outside.

## Technical Challenges: 
* Actioncable - it is used for web socket communication with frontend. We struggle with this when integrating with ReactJS like 2 times connecting for each user or channel not having values. We try to fix the bug as much as possible ;however, there are still bugs when loading a web page for the first time since the frontend server is open.
* ONNX.js - it is used for importing and running existing models in javascript. We found that our first ONNX model’s version is not compatible with ONNX.js. Then we had to downgrade it in order to use ONNX.js. Another problem is that clients may lag after running the model. 

## Related Works:
* [Google Quick Draw](https://quickdraw.withgoogle.com/)
* [Skribbl.io](https://skribbl.io/)

## Method and Results: Describe your detailed technical approach and innovations. Describe evaluation results (dataset and metric).
[Guess What You Draw ( Doodles Image Classifier )](https://github.com/ThreeTeaTree/Guess-What-You-Draw-Doodles-Classifier)

## Discussion and Future Work: 
### What are the limitations of your work?
* We have only 50 classes for doodle images.
* Available for PC only.
### What are areas for future improvements?
* Add more classes of doodle images
* Improve cable communication, for example, it's maybe bug if any player disconnects.
* Improve architecture of the system


