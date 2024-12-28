/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameobjects.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: momihamm <momihamm@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/11/23 22:25:20 by momihamm          #+#    #+#             */
/*   Updated: 2024/12/23 17:49:58 by momihamm         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class Paddle {
  // constructor(x, y, width, height, speed, bord, score) {
  //   this.x = x; // Paddle's x position
  //   this.y = y; // Paddle's y position
  //   this.width = width; // Paddle's width
  //   this.height = height; // Paddle's height
  //   this.speed = speed; // Paddle's movement speed
  //   this.bord = bord;
  //   this.score = score;
  // }

  // Method to draw the paddle
  show(p5, x, y, width, height, bord) {
    // p5.clear(x, y, width, height, bord);
    p5.rect(x, y, width, height, bord);
  }
}

export class Ball {
  constructor(x, y, radius, speedX, speedY, angle, canvasW, constSpeed) {
    this.x = x; // Ball's x position
    this.y = y; // Ball's y position
    this.radius = radius; // Ball's radius
    this.speedX = speedX; // Horizontal speed
    this.speedY = speedY; // Vertical speed
    this.angle = angle;
    this.canvasW = canvasW;
    this.constSpeed = constSpeed;
    // this.genSpeed = genSpeed;
  }

  // Method to draw the ball
  show(p5) {
    p5.fill(255);
    p5.ellipse(this.x, this.y, this.radius * 2);
  }
  
  move(p5, leftPaddle, rightPaddle) {
    this.x += this.speedX;
    this.y += this.speedY;
  
    // Bounce off top and bottom edges
    if (this.y - this.radius <= 0 || this.y + this.radius >= p5.height) {
      this.speedY *= -1;
    }
  
    // Boww
    // Right paddle
    else if (
      this.x + this.radius >= rightPaddle.x && // Right paddle
      this.y >= rightPaddle.y &&
      this.y <= rightPaddle.y + rightPaddle.height
    )
    
    {
      let pointOfColl, dirction;
      pointOfColl = this.y - (rightPaddle.y + (rightPaddle.height / 2));
      pointOfColl /= (rightPaddle.height / 2);
      this.angle = pointOfColl * (Math.PI / 4);
      if (this.x > (this.canvasW /2))
        dirction = -1;
      else
        dirction = 1;
        this.speedX = dirction * this.constSpeed * Math.cos(this.angle);
        this.speedY =  Math.sin(this.angle) * this.constSpeed;
    }
  
    // Reset ball if it goes out of bounds
    if (this.x - this.radius <= 0) {
      rightPaddle.score++;// rightScore++; // Right player scores
      this.reset(p5);
    } else if (this.x + this.radius >= p5.width) {
      leftPaddle.score++;// leftScore++; // Left player scores
      this.reset(p5);
    }
  }

  
  reset(p5) {
    this.x = p5.width / 2;
    this.y = p5.height / 2;
    this.speedX *= -1; // Start moving towards the scoring player
  }

}