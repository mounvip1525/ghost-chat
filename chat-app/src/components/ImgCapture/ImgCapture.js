import React , {useState} from "react";
import Webcam from "react-webcam";
import './ImgCapture.css'

const ImgCapture = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [showCam,setCam] = useState(true);


  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  console.log(imgSrc,showCam)

  return (
    <div className="video-container">
      {showCam &&
            <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />}
      <button onClick={capture}>Capture photo</button>
      {imgSrc && (
        <img
          src={imgSrc}
        />
      )}
      <button onClick={()=>setCam(!showCam)}>Toggle</button>
    </div>
  );
};

  export default ImgCapture;