/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   page.jsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: momihamm <momihamm@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/19 12:41:28 by momihamm          #+#    #+#             */
/*   Updated: 2024/12/28 19:29:36 by momihamm         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './index.css'; // Import the CSS file
// import Canvas from './canvas';
import React, { useState, useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import { Paddle, Ball } from './gameobjects';
import useWebSocket from 'react-use-websocket';

function Back() {
  return <div className="background"></div>;
}
let yL = 0
let yR = 0
let xR = 0
let xL = 0
let paddleHeight = 0
let paddleWidth = 0
let paddleSpeed = 0
let bord = 0
let canvasH = 0
let canvasW = 0
let ballX =  0
let ballY =  0
let radius =  0
let speedX = 0
let speedY =  0
let constSpeed = 0
let angle = 0
let score = 0
let leftPaddle = '' 
let rightPaddle = ''
let ball = ''

//ji  = data['canvas_height']
function App() {
  const [gameUrl] = useState('ws://127.0.0.1:8000/ws/ping_pong');
  const { sendMessage, lastMessage, readyState } = useWebSocket(gameUrl);
  const [playerNumber, setPlayerNmber] = useState('')
  // const [matchNumber, setMatchNmber] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [gameG, setGame] = useState('')
  
  useEffect(() => {
        if (readyState === WebSocket.OPEN){
          if (lastMessage != null){
            const data = JSON.parse(lastMessage.data);
            console.log(data)
            if (data['type'] === 'connection'){
              setPlayerNmber(data['information']['player_number'])
              setPlayerName(data['information']['player_name'])
            }
            if (data['type'] === 'game_started')
              {
                  canvasH = data.paddleLeft.canvasHeight
                  canvasW = data.paddleRight.canvasWidth
                  console.log (canvasH)
                  console.log (canvasW)
                  // canvasH = data['canvas_height']
                  // canvasW = data['canvas_width']
                  if (data.player.player_number === '1'){
                      rightPaddle = data.paddleRight;
                      leftPaddle = data.paddleLeft;
                      ball = data.ball;
                    }
                    else{
                      leftPaddle = data.paddleLeft;
                      rightPaddle = data.paddleRight;
                      ball = data.ball;
                  }
                  setGame(data.game_group)
                
              }
            if (data['type'] === "paddleMoved")
              {
                // console.log(data);
                if (data['playerNumber'] === '1'){
                  rightPaddle = data.updateY;
                }
                else{
                  leftPaddle = data.updateY;
                }
              }
            if (data['type'] === "ballUpdated"){
              ballX = data.ball.x;
              ballY = data.ball.y;
              // console.log(ballX)
            }
            }
              
          }
        }, [lastMessage])
  const show = (p5, x, y, width, height, bord) => {
    p5.rect(x, y, width, height, bord);
  }

  // momihamm
  // const ballShow = (p5, bx, by, bradius, bspeedX, bspeedy, bangle, bcanvasW, bconstSpe) => {
  //   p5.fill(255);
  //   p5.ellipse(bx,by,bradius * 2);
  // }
  // momihamm
  
  const Canvas = () => {
    
    // let paddleWidth = width;//= p5.width * 0.02; // 2% of canvas width
    // let paddleHeight = height;// = p5.height * 0.2; // 20% of canvas height
    // let ballRadius = 0;// p5.width * 0.02; // 2% of canvas width
    // let initAngle = 0;
    // let constBallSpeed = ballSpeed;
    
      const setup = (p5, canvasParentRef) => {
      const canvasWidth = canvasW; // 80% of window width
      const canvasHeight = canvasH; // 80% of window height
      const canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  
      // Position the canvas
      canvas.style('position', 'absolute'); // Use absolute positioning
      canvas.style('top', '2%');          // Move 20% down
      canvas.style('left', '10%');         // Move 10% to the right
      canvas.style('border-radius', '15px');
      canvas.style('border', '2px dashed white');
      canvas.style('background', '#000000');
      // leftPaddle = new Paddle(leftPaddle.x , leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.speed,10, leftPaddle.score);
      // // console.log(yR)
      // rightPaddle = new Paddle(rightPaddle.x , rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.speed, 10, rightPaddle.score);
      // ball = new Ball(ballX, ballY, radius, speedX, speedY, angle, canvasWidth, speedY);//momihamm
      p5.frameRate(60);
    };
    
    const handlePaddleMovement = (p5) => {
      // console.log("whach dkhel be3da");
      // Move left paddle with W (up) and S (down)
      if (p5.keyIsDown(87) || p5.keyIsDown(p5.UP_ARROW)) { // 'W' key
        // console.log(playerNumber)
        // console.log(playerName)
        // console.log(gameG)
        // leftPaddle.y = Math.max(0, leftPaddle.y - leftPaddle.speed); // Prevent moving out of bounds
        // console.log(leftPaddle.y)
        sendMessage(JSON.stringify({
          'type' : 'paddleMove',
          'direction': 'up',
          'playerNumber': playerNumber,
          'playerName': playerName,
          'gameGroup': gameG
        }))
      }
      if (p5.keyIsDown(83) || p5.keyIsDown(p5.DOWN_ARROW)) { // 'S' key
        // leftPaddle.y = Math.min(p5.height - leftPaddle.height, leftPaddle.y + leftPaddle.speed);
        sendMessage(JSON.stringify({
          'type' : 'paddleMove',
          'direction': 'down',
          'playerNumber': playerNumber,
          'playerName': playerName,
          // 'paddley': leftPaddle.y,
          // 'paddlex': leftPaddle.x,
          'gameGroup': gameG
        }))
      }
      
    };
    
    const draw = (p5) => {
      const centerX = canvasW / 2; // Center of the canvas
      const heightT = canvasH;        // Gap between dashes
      
      // p5.background('#000000');
      p5.stroke(255);           // Set line color to white
      p5.strokeWeight(2);           // Set line thickness
      // Loop to draw dashes
      p5.line(centerX, 0, centerX, heightT); // Draw each dash
      // Set up text properties
      p5.fill(255); // White color for the text
      p5.noStroke(); // No border around the text
      p5.textSize(canvasW * 0.1); // Text size relative to canvas width
      p5.textAlign(p5.CENTER, p5.CENTER); // Center align text
      handlePaddleMovement(p5);
      show(p5, leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 10);
      // p5.rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 10);
      show(p5, rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height,  10);
      // p5.fill(255);
      // p5.ellipse(ballX, ballY, 20);
      // console.log(ball)
      // p5.text(leftPaddle.score, canvasW * 0.25, canvasH * 0.2); // Left score at 25% width
          // p5.text(rightPaddle.score, canvasW * 0.75, canvasH * 0.2); // Right score at 75% width
          // ball.show(p5);
      };
        
      const windowResized = (p5) => {
      const canvasWidth = canvasW; // 80% of window width
      const canvasHeight = canvasH; // 60% of window height
      leftPaddle.x = canvasWidth * 0.01; 
      paddleWidth = canvasWidth * 0.01;
      rightPaddle.x = canvasWidth * 0.99 - paddleWidth;
      leftPaddle.width = canvasWidth * 0.01;
      rightPaddle.width = canvasWidth * 0.01;
      ball.radius = canvasWidth * 0.02;;
      ball.x = canvasWidth * 0.5;
      ball.y = canvasHeight * 0.5;
    };
    return <Sketch setup={setup}  windowResized={windowResized} draw={draw} />;
    
  };
  return (
    <div className="relative">
      <Back />
      {/* <h1 style={{ textAlign: 'center', color: '#fff', margin: '20px 0' }}>My Game</h1> */}
      <Canvas />
    </div>
  );
}

export default App;
