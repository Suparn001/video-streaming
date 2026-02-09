import { useState } from 'react'
import './App.css'
import VideoUpload from './components/VideoUpload'

function App() {

  const [videoId, setVideoId] = useState("ef1febcc-e929-4381-940c-87723f753bcc");

  return (
    <>
      <div className='flex flex-col items-center space-y-5 justify-center py-9'>
        <h1 className='text-3xl font-bold text-gray-700 dark:text-gray-100'>Video Streaming App</h1>

        <div className='flex mt-14 w-full justify-around'>
          <div>
            <h1 className='text-white'>
              Playing video
            </h1>
            <video
              style={
                {
                  width: 500,
                  height: 500
                }
              }
              src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`} controls></video>
          </div>
          <VideoUpload />
        </div>
      </div>
    </>
  )
}

export default App
