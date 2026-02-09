import { useState } from 'react'
import './App.css'
import VideoUpload from './components/VideoUpload'
import VideoPlayer from './components/VideoPlayer';
import { Button, TextInput } from 'flowbite-react';

function App() {

  const [videoId, setVideoId] = useState("408c372e-6109-43cc-af6a-f55468c14cb8");

  const [fieldValue, setFieldValue] = useState("");

  function playVideoId(videoId) {
    setVideoId(videoId);
  }

  return (
    <>
      <div className='flex flex-col items-center space-y-5 justify-center py-9'>
        <h1 className='text-3xl font-bold text-gray-700 dark:text-gray-100'>Video Streaming App</h1>

        <div className='flex mt-14 w-full justify-around'>
          <div>
            <h1 className='text-white text-center'>
              Playing video
            </h1>

            <div>
              <VideoPlayer src={`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`} />
            </div>
          </div>

          <div className='w-full'>
            <VideoUpload />
          </div>
        </div>
        <div>
          <TextInput
            onChange={(event) => {
              setFieldValue(event.target.value);
            }}
            className='my-4'
            placeholder='Enter Video Id'
            name='video_id_field' />
          <Button
            onClick={() => {
              setVideoId(fieldValue);
            }}
            className='my-4 flex space-x-4'>
            Load Video
          </Button>
        </div>

      </div>
    </>
  )
}

export default App
