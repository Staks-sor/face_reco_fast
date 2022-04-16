import time
import cv2
import uvicorn
import base64
import numpy as np
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi import WebSocket
import websocket





app = FastAPI()
templates = Jinja2Templates(directory="templates")

def data_uri_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


if __name__ == '__main__':

    SOCKET_IO_HOST = "127.0.0.1"
    SOCKET_IO_PORT = 5000

    socket_io_url = 'ws://' + SOCKET_IO_HOST + ':' + str(SOCKET_IO_PORT) + '/socket.io/?EIO=3&transport=websocket'


    ws = websocket.create_connection(socket_io_url)

    while True:
        print(ws.recv())
    
    # uvicorn.run("main:app", host="127.0.0.1", port=8000, access_log=False)

    




@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_bytes()
        print(f"received: {data}")
        
        img = data_uri_to_cv2_img(data)
        # cv2.imshow('test',img)
        # cv2.waitKey(1)
        # image = VideoCamera.get_frame()
        # print(gen(VideoCamera()))
        # await websocket.send_text(data)



