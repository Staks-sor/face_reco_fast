import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from 'react';
import {useDropzone} from 'react-dropzone';



function App() {

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

  const [mode, setMode] = useState('camera')
  const [recordedChunks, setRecordedChunks] = useState([]);

  const [rec_data, setRecData] = useState({})

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const boxRef = useRef(null);

  // const [socket, setSocket] = useState(null);

  useEffect(() => {




    const boxCanvas = boxRef.current;
    const boxContext = boxCanvas.getContext('2d');

    
    boxCanvas.width = webcamRef.current.video.videoWidth
    boxCanvas.height = webcamRef.current.video.videoHeight
    
    boxContext.lineWidth = "4"
    boxContext.strokeStyle = "red";


    boxContext.strokeRect(rec_data?.region?.x, rec_data?.region?.y, rec_data?.region?.w, rec_data?.region?.h)



  }, [rec_data]);


  

  
  // const ws = new WebSocket("ws://localhost:5000/ws");  
  // ws.binaryType = "arraybuffer";
  // ws.onopen = function(e) {
  //     console.log("[open] Connection established");
  // };



    // const handleMedia = (e) => {
    //     const recorder = new MediaRecorder(e)
    //     // console.log(imageSrc)
    //     // ws.binaryType = "arraybuffer";
    //     recorder.ondataavailable = event => {

    //         // get the Blob from the event
    //         const blob = event.data;

    //         setWSData(blob)

    //         let file = new File([blob], "file");

    //         let formData = new FormData()

    //         formData.append('file', blob)

    //         fetch(`http://localhost:8000/files`, {
    //           method: 'POST',
    //           body: formData
    //         })
    //         .then(res => res.json())
    //         .then(json => {
    //           console.log(json)
    //         })
    //         .catch(e => {
    //           console.log(e)
    //         })
              

    //     };

    //     recorder.start(5000);
    // }

        
    const handleMedia = (e) => {
      
      

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      
      const boxCanvas = boxRef.current;
      const boxContext = boxCanvas.getContext('2d');

      

      function sendImage() {


        function postFile(file, context) {
          console.log(1)
          //Set options as form data
          let formdata = new FormData();
          formdata.append("file", file);
                      //141.8.195.228
          fetch(`http://localhost:8000/files`, {
            method: 'POST',
            body: formdata
          })
          .then(res => res.json())
          .then(json => {
            setRecData(json)
            sendImage()
          })
          .catch(e => {
            console.log(e)
            sendImage()
          })
        }

        canvas.width = webcamRef.current.video.videoWidth
        canvas.height = webcamRef.current.video.videoHeight
        
        
        context.drawImage(webcamRef.current.video, 0, 0, webcamRef.current.video.videoWidth, webcamRef.current.video.videoHeight)
        canvas.toBlob((file) => {postFile(file, boxContext)}, 'image/jpeg')
      }
        
      sendImage()

        // console.log(rec_data?.region?.x)
        




  }
        

  

  const data = [
    {color: '#780E9D', type: 'Эмоция', value: rec_data?.dominant_emotion, icon: '🙂'},
    {color: '#EC2929', type: 'Раса', value: 'Европеоидная', icon: '👨'},
    // {color: '#F612C4', type: 'Пол', value: 'Мужской', icon: '👔'},
    {color: '#2A2', type: 'Тест', value: 'Хз чо писать', icon: '🙂'},
  ]

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));



  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <main>
          <div className='data_block'>
            <div className='switcher'>
                <button className={mode == 'camera' && 'active'} onClick={e => {setMode('camera')}}>
                    Камера
                </button>
                <button className={mode == 'photo' && 'active'} onClick={e => {setMode('photo')}}>
                    Фото
                </button>
            </div>
            {
              mode == 'camera' ? (
                <>
                  {/* <div className='camera_block' style={{position: 'relative', zIndex: 0, width: canvasRef?.current?.width, height: canvasRef?.current?.height}} >

                  
                  
                  </div> */}
                  <div className='camera_block' style={{position: 'relative'}}>

                    <Webcam 
                      // id="sourceVideo"
                      style={{zIndex: 10}}
                      screenshotFormat="image/jpeg"
                      onUserMedia={(e) => handleMedia(e)}
                      ref={webcamRef}
                    />
                    
                    <canvas style={{position: 'absolute', top: 0, left: 0, zIndex: 0}} ref={canvasRef}>
                    </canvas>
                    <canvas style={{position: 'absolute', top: 0, left: 0, zIndex: 20}} ref={boxRef}></canvas>
                  </div>
                </>
              ) : (
                <section className="upload_block">
                  <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p style={{fontSize: 36, fontWeight: 700}}>ПЕРЕТАЩИТЕ</p>
                    <p style={{fontSize: 20, fontWeight: 700}}>или</p>
                    <p style={{fontSize: 36, fontWeight: 700}}>НАЖМИТЕ</p>
                    <p style={{fontSize: 20, fontWeight: 700}}>для загрузки файлов</p>
                  </div>
                  <aside>
                    <ul>{files}</ul>
                  </aside>
                </section>
              )
            }
          </div>
          <div className='info_block'>
              <h2>РЕЗУЛЬТАТЫ РАСПОЗНАВАНИЯ</h2>
              <div className='recognition_results'>
                  <div className='recognition_card'>
                    <div className='features'>
                      {data.map(item => (
                        <div key={item.color} className='features_item' >
                          <div className='features_item__header' style={{background: item.color}}>
                            <p>{item.type}</p>
                          </div>
                          <div className='features_item__body' style={{border: `2px solid ${item.color}`}}>
                              <div className='feature_icon'>
                                {item.icon}
                              </div>
                              <div className='feature_text'>
                                {item.value}
                              </div>
                          </div>
                        </div>
                      ))}
                      <div className='features_item' >
                          <div className='features_item__header' style={{background: '#333'}}>
                            <p>Пол</p>
                          </div>
                          <div className='features_item__body' style={{border: `2px solid #333`}}>
                              <div className='feature_icon'>
                              👔
                              </div>
                              <div className='feature_text'>
                                {rec_data?.gender == 'Woman' ? 'Женский' : 'Мужской'}
                              </div>
                          </div>
                        </div>
                      
                    </div>
                    <div className='card_footer'>
                        <div className='card_footer__age'>
                            <span>{rec_data?.age}</span> лет
                        </div>
                        <div className='card_footer__number'>
                            1
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
}

export default App;
