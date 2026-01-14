import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/common-backend/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);
  
  const url = request.url;
  const queryParams = new URLSearchParams(url?.split('?')[1]);
  const token = queryParams.get('token');
  
  const decoded = jwt.verify(token as string, JWT_SECRET) as jwt.JwtPayload; 
  
  if (!decoded || !decoded.userId) {
    ws.close(1008, 'Unauthorized');
    return;
  }
  

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send("pong");
  });

  ws.send('something');
});