from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
# import asyncio
import threading

    # def move(self, rightX, leftX, rightY, leftY, paddleWidth, paddleHeight):
    #     # Update ball position
    #     self.x += self.speedX
    #     self.y += self.speedY
    #     # Bounce off top and bottom edges
    #     if self.y - self.radius <= 0 or self.y + self.radius >= self.canvas_height:
    #         self.speedY *= -1
    #     # Right paddle collision
    #     if (
    #         self.x + self.radius >= rightX and
    #         rightY <= self.y <= rightY + paddleHeight
    #     ):
    #         self._bounce(paddleHeight, rightY)
    #     # Left paddle collision
    #     elif (
    #         self.x - self.radius <= leftX + paddleWidth and
    #         leftY <= self.y <= leftY + paddleHeight
    #     ):
    #         self._bounce(paddleHeight, leftY)
    #     # Scoring logic
    #     if self.x - self.radius <= 0:
    #         return 'right'  # Right player scores
    #     elif self.x + self.radius >= self.canvas_width:
    #         return 'left'  # Left player scores
    #     return None  # No scoring
    
    # def _bounce(self, paddleheight, paddleY):
    #     point_of_coll = (self.y - (paddleY + paddleheight / 2)) / (paddleheight / 2)
    #     self.angle = point_of_coll * (math.pi / 4)
    #     direction = 1 if self.speedX < 0 else -1
    #     self.speedX = direction * self.constSpeed * math.cos(self.angle)
    #     self.speedY = self.constSpeed * math.sin(self.angle)

    # def reset(self):
    #     self.x = self.canvas_width / 2
    #     self.y = self.canvas_height / 2
    #     self.speedX *= -1  # Reverse direction
    #     self.speedY = 0

class Ball:
    def __init__(self,x, y, radius, speedX, speedY, angle, canvasW, canvasH, constSpeed, scoreLeft, scoreRight):
        self.x = x
        self.y = y
        self.radius = radius
        self.speedX = speedX
        self.speedY = speedY
        self.angle = angle
        self.canvas_width = canvasW
        self.canvas_height = canvasH
        self.constSpeed = constSpeed
        self.scoreLeft = scoreLeft
        self.scoreRight = scoreRight
    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'radius' :self.radius,
            'speedX': self.speedX,
            'speedY': self.speedY,
            'angle': self.angle,
            'canvas_width': self.canvas_width,
            'canvas_height': self.canvas_height,
            'constSpeed': self.constSpeed,
            'scoreLeft': self.scoreLeft,
            'scoreRight': self.scoreRight
        }
        # this.genSpeed = genSpeed;
        
  
          


class Match:
    def __init__(self, player_1, player_2, group_name, match_number):
        self.player1 = player_1
        self.player2 = player_2
        self.group_name = group_name
        self.match_number = match_number
        self.is_active = True

    def players(self):
        return [self.player1, self.player2, self.group_name, self.match_number, self.is_active]
    
    
class Paddle:
    def __init__(self, paddleWidth, paddleHeight, paddleX, paddleY, paddleSpeed, paddleBord, canvasHeight, canvasWidth):
        self.paddleWidth = paddleWidth
        self.paddleHeight = paddleHeight
        self.paddleX = paddleX
        self.paddleY = paddleY
        self.paddleSpeed = paddleSpeed
        self.paddleBord = paddleBord
        # self.paddleScore = paddleScore #momihamm
        self.canvasHeight = canvasHeight
        self.canvasWidth = canvasWidth
    def to_dict(self):
        return {
            'width': self.paddleWidth,
            'height': self.paddleHeight,
            'x': self.paddleX,
            'y': self.paddleY,
            'speed': self.paddleSpeed,
            'border': self.paddleBord,
            # 'score': self.paddleScore,
            'canvasHeight': self.canvasHeight,
            'canvasWidth': self.canvasWidth 
        }

class GameClient(AsyncWebsocketConsumer):
    
    # def __init__(self):
    #     self.is_active = False
    # def __init__(self):
    #     self.is_active = False
    #     self.group_name = None
    #     self.ball_movement_task = None
    connected_sockets = []
    active_matches = []
    canvasHeight = 400
    canvasWidth = 600
    # is_active = False #momihamm
    # group_name = "" #momihamm
    ball = Ball(
        x=canvasWidth // 2,
        y=canvasHeight // 2,
        radius=10,
        speedX=2,
        speedY=2,
        angle=0,
        canvasW=canvasWidth,
        canvasH=canvasHeight,
        constSpeed=0.2,
        scoreLeft=0,
        scoreRight=0
    )
    paddleRight = Paddle(
        paddleWidth=10,
        paddleHeight=100,
        paddleX=canvasWidth * 0.98,
        paddleY=100,
        paddleSpeed=10,
        paddleBord=10,
        # paddleScore=0,
        canvasHeight=canvasHeight,
        canvasWidth=canvasWidth
    )
    paddleLeft = Paddle(
        paddleWidth=10,
        paddleHeight=100,
        paddleX=canvasWidth * 0.01,
        paddleY=100,
        paddleSpeed=10,
        paddleBord=10,
        # paddleScore=0,
        canvasHeight=canvasHeight,
        canvasWidth=canvasWidth
    )
    
    async def connect(self):
        self.player = {}
        await self.accept()
        self.scope['player_name'] = self.channel_name
        self.player = {
            'player_name': self.channel_name,
            'player_number': '',
        }
        if len (self.connected_sockets) % 2 == 0:
            self.player['player_number'] = '1'
        else:
            self.player['player_number'] = '2'
        self.connected_sockets.append(self.player)
        await self.send(json.dumps({
            'type': 'connection',
            'information': self.player
        }))
        if len(self.connected_sockets) >= 2:
            player1 = self.connected_sockets.pop(0)
            player2 = self.connected_sockets.pop(0)
            self.group_name = f'group_{len(self.active_matches)}'
            self.new_match = Match(player1, player2, self.group_name, len(self.active_matches))
            await self.channel_layer.group_add(self.new_match.group_name, player1['player_name'])
            await self.channel_layer.group_add(self.new_match.group_name, player2['player_name'])
            self.active_matches.append(self.new_match)
            # print(self.ball.to_dict())
            await self.channel_layer.send(player1['player_name'], 
                {
                    'type': 'game_started',
                    'game_group': self.new_match.group_name,
                    'player': player1,
                    'paddleRight': self.paddleRight.to_dict(),
                    'paddleLeft': self.paddleLeft.to_dict(),
                    'ball': self.ball.to_dict()
                })
            await self.channel_layer.send(player2['player_name'],
                {
                    'type': 'game_started',
                    'game_group': self.new_match.group_name,
                    'player': player2,
                    'paddleRight': self.paddleRight.to_dict(),
                    'paddleLeft': self.paddleLeft.to_dict(),
                    'ball': self.ball.to_dict()
                })
            
            
        
        
    async def receive(self, text_data):
       
        try:
            data = json.loads(text_data)
        except Exception as e:
            print("error :", e)
        if data['type'] == 'paddleMove':
            if data['type'] == 'paddleMove':
                if data['playerNumber'] == '1':
                    self._move_paddle(self.paddleRight, data['direction'])
                elif data['playerNumber'] == '2':
                    self._move_paddle(self.paddleLeft, data['direction'])

                group_name = data['gameGroup']
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'paddleMoved',
                        'playerNumber': data['playerNumber'],
                        'updateY': self.paddleRight.to_dict() if data['playerNumber'] == '1' else self.paddleLeft.to_dict()
                    }
                )
                
                
    def _move_paddle(self, paddle, direction):
        if direction == 'up' and paddle.paddleY > 0:
            paddle.paddleY -= 10
        elif direction == 'down' and paddle.paddleY < (paddle.canvasHeight - paddle.paddleHeight):
            paddle.paddleY += 10
                
    
    async def game_started(self, event):
        await self.send(json.dumps({
            'type': event['type'],
            'game_group': event['game_group'],
            'player': event['player'],
            'paddleRight': event['paddleRight'],
            'paddleLeft': event['paddleLeft'],
            'ball': event['ball']
        }))
        #ball moving
        self.is_active = True
        asyncio.create_task(self.start_ball_movement())


    async def start_ball_movement(self):
        while self.is_active:
            # Update the ball's position
            # self.game_group 
            # print(self.group_name, flush=True)
            self.ball.x += self.ball.speedX
            self.ball.y += self.ball.speedY

            # Check for collision with the top and bottom boundaries
            if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= self.ball.canvas_height:
                self.ball.speedY *= -1  # Reverse the vertical direction

            # # Check for collision with the paddles
            # if self._check_paddle_collision(self.paddleRight) or self._check_paddle_collision(self.paddleLeft):
            #     self.ball.speedX *= -1  # Reverse the horizontal direction
            if await self._check_paddle_collision(self.paddleLeft, "left"):
                self.ball.speedX *= -1  # Reverse the horizontal direction
            if await self._check_paddle_collision(self.paddleRight, "Right"):
                self.ball.speedX *= -1
            # flAge = False 
            # flAge = await self._check_paddle_collision(self.paddleLeft)
            # print (flAge)
            #     # if self._check_paddle_collision(self.paddleRight):
            # if flAge == True:
            #     print("YES!")
            # if flAge == False:
            #     print("NO")
            #     # else:
            #     #   print("NO!")
                # self.ballspeedX *= -1  # Reverse the horizontal direction
                # print(self.ball.x)
                # print(">>><<<")
                # print(self.paddleLeft.paddleX)

            # print("kane")
            # Check if the ball has passed the left or right boundary
            if self.ball.x - self.ball.radius <= 0:
                await self._reset_ball(self.paddleRight, "Right")  # Reset the ball to the center 
            if self.ball.x + self.ball.radius >= self.ball.canvas_width:
                await self._reset_ball(self.paddleLeft, "Left")
            # if self.ball.x - self.ball.radius <= 0 or self.ball.x + self.ball.radius >= self.ball.canvas_width:
            #     await self._reset_ball()  # Reset the ball to the center 
            # if self.ball.x - self.ball.radius <= 0 or self.ball.x + self.ball.radius >= self.ball.canvas_width:
            #     # self.ball.speedY *= -1
            #     self.ball.speedX *= -1

            # Broadcast the updated ball position to the group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'ballUpdated',
                    'ball': self.ball.to_dict()
                }
            )
            # print("Mane")
            # Control the frame rate (e.g., 60 FPS)
            await asyncio.sleep(1/60)

    
    async def ballUpdated(self, event):
        await self.send(json.dumps({
            'type': event['type'], 
            'ball': event['ball'] 
        }))

    async def _check_paddle_collision(self, paddle, lORr):
        # print ("mimi")
        # print ("kmiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
            # print (self.ball.x , paddle.paddleX)
        if (lORr == "left"):
            if self.ball.x - self.ball.radius <= paddle.paddleX + paddle.paddleWidth and self.ball.y - self.ball.radius >= paddle.paddleY and self.ball.y + self.ball.radius <= paddle.paddleY + paddle.paddleHeight: #and 
            #    print ("7liwa")
               return True
            else:
            #    print ("bayern")
               return False
        if (lORr == "Right"):
            if self.ball.x + self.ball.radius >= paddle.paddleX and self.ball.y - self.ball.radius >= paddle.paddleY and  self.ball.y + self.ball.radius <= paddle.paddleY + paddle.paddleHeight:
                # print ("kmi") 
                return True
            else:
                # print ("stormy")
                return False
                # (
                    
                    
                    # self.ball.x - self.ball.radius <= paddle.paddleX + paddle.paddleWidth and
                    # self.ball.y >= paddle.paddleY and
                    # self.ball.y <= paddle.paddleY + paddle.paddleHeight
                # )
    # async def _check_paddle_collision(self, paddle):
    #     return (
    #         self.ball.x + self.ball.radius >= paddle.paddleX #and
    #         # self.ball.x - self.ball.radius <= paddle.paddleX + paddle.paddleWidth and
    #         # self.ball.y >= paddle.paddleY and
    #         # self.ball.y <= paddle.paddleY + paddle.paddleHeight
    #     )
    
    async def _reset_ball(self, paddle, lorr):
        self.ball.x = self.ball.canvas_width // 2
        self.ball.y = self.ball.canvas_height // 2
        self.ball.speedX *= -1  # Reverse the horizontal direction
        # self.ball.speedY = 5 if self.ball.speedY > 0 else -5  # Reset to initial vertical speed
        # zid f score
        # paddle.paddleScore += 1
        if lorr == "Left":
            print ("left")
            self.ball.scoreRight += 1
        if lorr == "Right":
            print ("Right")
            self.ball.scoreLeft += 1


    async def paddleMoved(self, event):
        await self.send(json.dumps({
            'type': event['type'],
            'playerNumber': event['playerNumber'],
            'updateY': event['updateY']
        }))
    
    

    async def player_disconnected(self, event):
        await self.send(json.dumps({
            'type': event['type'],
            'message': event['type']
        }))
        
    # async def ball_update(self, event):
    #     await self.send(json.dumps({
    #         'type': 'ball_update',
    #         'ballX': event['ballX'],
    #         'ballY': event['ballY']
    #     }))