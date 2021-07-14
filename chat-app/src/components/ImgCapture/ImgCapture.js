import React , { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Webcam from "react-webcam";
import './ImgCapture.css';
import CloseIcon from '@material-ui/icons/Close';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [showCam,setCam] = useState(true);


  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setCam(false);
  }, [webcamRef, setImgSrc]);

//   console.log(imgSrc,showCam);

  const handleRetake = () => {
      setCam(true);
      setImgSrc("");
  }

  const handleSend = () => {
      props.send(imgSrc);
      setImgSrc("");
      setCam(true);
      handleClose();
  }

  const closeModal = () => {
    setImgSrc("");
    setCam(true);
    handleClose();
  }

  return (
    <div className="cam-cont">
      {/* <Button> */}
        <CameraAltIcon onClick={handleClickOpen} className="icon" />
      {/* </Button> */}
      <Dialog
        open={open}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                Take a photo! 
                <button onClick={closeModal} style={{background:"transparent",border:"none",outline:"none",cursor:"pointer"}}>< CloseIcon /></button>
            </div>
        </DialogTitle>
        <DialogContent>
        <div className="video-container">
            {showCam &&
                    <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    height={250}
                    width={250}
                />}
            {
            imgSrc && (
                <img
                src={imgSrc}
                alt='img'
                />
            )}
            <div className="btn-cont">
                {imgSrc ? <button onClick={handleRetake} className="retake">Retake</button> : 
                <div onClick={capture} className="capture"><div onClick={capture}></div></div>}
            </div>
            </div>
        </DialogContent>
        <DialogActions>
                {imgSrc &&           
                <Button onClick={handleSend} color="default" autoFocus>
                    Send
                </Button>
                }
        </DialogActions>
      </Dialog>
    </div>
  );
}