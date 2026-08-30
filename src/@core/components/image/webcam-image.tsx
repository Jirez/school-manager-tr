import React from 'react'
import Webcam from 'react-webcam'
import { Camera } from 'react-feather'

const videoConstraints = {
  width: 1280,
  height: 820,
  facingMode: 'user',
}

interface Props {
  onShot: (data: any) => void
}

const WebcamImage: React.FC<Props> = ({ onShot }) => {
  const webcamRef = React.useRef<any>(null)
  // const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    // console.log(imageSrc);

    onShot(imageSrc)
  }, [webcamRef, onShot])

  return (
    <>
      <Webcam
        audio={false}
        height={350}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        width={350}
        videoConstraints={videoConstraints}
        checked={false}
        className="border-primary border-dotted border-1  rounded-md mb-1"
      />

      <div
        className="flex flex-row justify-center text-primary"
        title={'Take a picture'}
      >
        <Camera type="button" onClick={capture} size={32} />
      </div>

      {/* {imgSrc && (
        <img
          src={imgSrc}
        />
      )} */}
    </>
  )
}

export default WebcamImage
