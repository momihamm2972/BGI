/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   canvas.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: yamajid <yamajid@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/22 17:42:58 by momihamm          #+#    #+#             */
/*   Updated: 2024/11/28 01:06:29 by yamajid          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import React, { useState, useEffect } from 'react';
// import Sketch from 'react-p5';
// import { Paddle, Ball } from './gameobjects';
// import useWebSocket from 'react-use-websocket';

// const Canvas = () => {
//   const [gameUrl, setGameUrl] = useState('ws://127.0.0.1:8000/ws/ping_pong')
//   // const [sendMessage ,lastMessage, readyState] = useWebSocket(gameUrl)
  
//   useEffect(() => {
    
//     let leftPaddle, rightPaddle, ball;
//     let paddleWidth = 0;//= p5.width * 0.02; // 2% of canvas width
//     let paddleHeight = 0;// = p5.height * 0.2; // 20% of canvas height
//     let ballRadius = 0;// p5.width * 0.02; // 2% of canvas width
//     let initAngle = 0;
//   // let constBallSpeed = ballSpeed;
  
//     const setup = (p5, canvasParentRef) => {
//     const canvasWidth = p5.windowWidth * 0.6; // 80% of window width
//     const canvasHeight = p5.windowHeight * 0.5; // 80% of window height
//     const canvas = p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
//     let initScore = 0;
//     let ballSpeed = 10 ;
//     paddleWidth = canvasWidth * 0.01; // 2% of canvas width
//     paddleHeight = canvasHeight * 0.2; // 20% of canvas height
//     ballRadius = canvasWidth * 0.02; // 2% of canvas width

//     // if (readyState === WebSocket.OPEN){
//     //   if (lastMessage != null){
//     //     const data = JSON.parse(lastMessage);
//     //     if (data['type'] === 'game_started')
//     //         console.log('success');
//     //   }

//     // }
//     // Position the canvas
//     canvas.style('position', 'absolute'); // Use absolute positioning
//     canvas.style('top', '2%');          // Move 20% down
//     canvas.style('left', '10%');         // Move 10% to the right
//     canvas.style('border-radius', '15px');
//     canvas.style('border', '2px dashed white');
//     leftPaddle = new Paddle(p5.width * 0.01 , p5.height * 0.4, paddleWidth, paddleHeight, 10, 10, initScore);
//     rightPaddle = new Paddle(p5.width * 0.99 - paddleWidth, p5.height * 0.4, paddleWidth, paddleHeight, 10, 10, initScore);
//     ball = new Ball(canvasWidth * 0.5, canvasHeight * 0.5, ballRadius, ballSpeed, 0, initAngle, canvasWidth, ballSpeed);
//     p5.frameRate(60);
//   };
  
//   const handlePaddleMovement = (p5) => {
//     // console.log("whach dkhel be3da");
//     // Move left paddle with W (up) and S (down)
//     if (p5.keyIsDown(87)) { // 'W' key
//       // console.log("W");
//       leftPaddle.y = Math.max(0, leftPaddle.y - leftPaddle.speed); // Prevent moving out of bounds
//     }
//     if (p5.keyIsDown(83)) { // 'S' key
//       leftPaddle.y = Math.min(p5.height - leftPaddle.height, leftPaddle.y + leftPaddle.speed);
//     }
    
//     // Move right paddle with UP and DOWN arrow keys
//     if (p5.keyIsDown(p5.UP_ARROW)) {
//       rightPaddle.y = Math.max(0, rightPaddle.y - rightPaddle.speed); // Prevent moving out of bounds
//     }
//     if (p5.keyIsDown(p5.DOWN_ARROW)) {
//       rightPaddle.y = Math.min(p5.height - rightPaddle.height, rightPaddle.y + rightPaddle.speed);
//     }
//   };
  
//   const draw = (p5) => {
//     const centerX = p5.width / 2; // Center of the canvas
//     const dashHeight = 2;        // Height of each dash
//     const gapHeight = 5;         // Gap between dashes
    
//     p5.background('#000000');
//     p5.stroke(255);               // Set line color to white
//     p5.strokeWeight(2);           // Set line thickness
//     // Loop to draw dashes
//     for (let y = 0; y < p5.height; y += dashHeight + gapHeight) {
//       p5.line(centerX, y, centerX, y + dashHeight); // Draw each dash
//     }
//     // Set up text properties
//     p5.fill(255); // White color for the text
//     p5.noStroke(); // No border around the text
//     p5.textSize(p5.width * 0.1); // Text size relative to canvas width
//     p5.textAlign(p5.CENTER, p5.CENTER); // Center align text
//     handlePaddleMovement(p5);
//     leftPaddle.show(p5);
//     rightPaddle.show(p5);
//     // if (! ball.speedY === 0)
//       // {
//         // if (ball.speedY < 0)
//           //   ball.speedY = ballSpeed * -1;
//         // else
//         //   ball.speedY = ballSpeed;
//         // }
//         // ball.speedX = ballSpeed;
//         ball.move(p5, leftPaddle, rightPaddle);
//         p5.text(leftPaddle.score, p5.width * 0.25, p5.height * 0.2); // Left score at 25% width
//         p5.text(rightPaddle.score, p5.width * 0.75, p5.height * 0.2); // Right score at 75% width
//         ball.show(p5);
//       };
      
//       const windowResized = (p5) => {
//         // Adjust the canvas size dynamically on window resize
//         const canvasWidth = p5.windowWidth * 0.6; // 80% of window width
//         const canvasHeight = p5.windowHeight * 0.5; // 60% of window height
//         leftPaddle.x = canvasWidth * 0.01; 
//         paddleWidth = canvasWidth * 0.01;
//         rightPaddle.x = canvasWidth * 0.99 - paddleWidth;
//         leftPaddle.width = canvasWidth * 0.01;
//         rightPaddle.width = canvasWidth * 0.01;
//         ball.radius = canvasWidth * 0.02;;
//     ball.x = canvasWidth * 0.5;
//     ball.y = canvasHeight * 0.5;
    
//     p5.resizeCanvas(canvasWidth, canvasHeight);
//   };
  
//   return <Sketch setup={setup}  windowResized={windowResized} draw={draw} />;
// }, [lastMessage]);

// };

// export default Canvas;
