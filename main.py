import time
import cv2
import uvicorn
import matplotlib.pyplot as plt
import base64
import numpy as np
import io
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
from fastapi import WebSocket
from fastapi.middleware.cors import CORSMiddleware
from recognition.main import face_analyze

app = FastAPI()
templates = Jinja2Templates(directory="templates")

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def data_uri_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img




@app.post("/files/")
async def create_file(file: bytes = File(...)):
    # print(formData)
    # def data_uri_to_cv2_img(uri):
    #     encoded_data = uri.split(',')[1]
    #     nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    #     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    #     return img

    # img = data_uri_to_cv2_img(file)

    # based = base64.b64encode(file)

    # print(based)
    

    # nparr = np.fromfile(file, np.uint8)
    # base64.b64decode(file).decode()

    nparr = np.fromstring(file, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    data = await face_analyze(img)

    print(data)

    # img = data_uri_to_cv2_img(file)

    # image_as_bytes = str.encode(formData)  # convert string to bytes
    # b64encoded_str = base64.b64decode(formData)  # decode base64string
    # file_bytes = np.fromstring(b64encoded_str, dtype=np.uint8)
    # img = cv2.imdecode(file_bytes, flags=cv2.IMREAD_UNCHANGED) #Here as well I get returned nothing
    
    # cv2.imshow('test', img)
    # cv2.waitKey(1)

    return data

    


if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, access_log=False)





