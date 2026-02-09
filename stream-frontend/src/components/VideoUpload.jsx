import React, { useState } from 'react'
import videoLogo from '../assets/video-posting.png'
import { Alert, Button, Card, FileInput, Label, Progress, Textarea, TextInput } from 'flowbite-react'
import axios from 'axios';
import { toast } from 'react-toastify';

const VideoUpload = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileChange(event) {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }


  function formFieldChange(event) {
    const { name, value } = event.target;
    console.log(name, value);
    setMeta((meta) => ({
      ...meta,
      [name]: value,
    }));
  }


  function handleForm(event) {
    event.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a video file");
      alert("Please select a video file");
      return;
    }
    // submit the video file and metadata to the server or storage service
    saveVideoToServer(selectedFile, meta);
    console.log(meta);
  }

  // submit ile to nserver

  async function saveVideoToServer(video, videoMetaData) {
    setUploading(true);
    try {

      const formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", selectedFile);
      let resposne = await axios.post("http://localhost:8080/api/v1/videos",
        formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }, onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
          const progressPercentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log(`Upload Progress: ${progressPercentage}%`);
          setProgress(progressPercentage);
        }
      });

      setProgress(0);
      setMessage(`Video Uploaded Successfully with id ${resposne.data.videoId}`);
      setUploading(false);
      toast.success("Video Uploaded Successfully");
      console.log(resposne);
      resetFrom();
    } catch (error) {
      setMessage("Error uploading video");
      setUploading(false);
      console.error("Error uploading video:", error);
    }
    // await saveVideoToServer();
  }

  function resetFrom() {
    setMeta({
      title: "",
      description: "",
    });

    setSelectedFile(null);
    setProgress(0);
    setUploading(false);
    // setMessage("");
  }

  return (
    <div className='text-white'>
      <Card className='flex flex-col justify-center items-center'>
        <h1>Upload Videos</h1>
        <div>
          <form
            onSubmit={handleForm}
            className="flex flex-col space-y-7">


            <div>
              <div className='mb-2 block'>
                <Label className="mb-2 block" htmlFor="enter-title">
                  Video Title
                </Label>
              </div>
              <TextInput
                value={meta.title}
                placeholder="Enter Title" id="enter-title"
                name='title'
                onChange={formFieldChange}
              />
            </div>

            <div className='max-w-md'>
              <div className='mb-2 block'>
                <Label className="mb-2 block" htmlFor="enter-description">
                  Description
                </Label>
              </div>
              <Textarea
                value={meta.description}
                rows={4}
                name='description'
                placeholder="Enter Description" id="enter-description"
                onChange={formFieldChange}
              />
            </div>

            <div className='flex item-center space-x-5
            justify-center
            '>

              <div className="shrink-0">
                <img className="h-16 w-16 object-cover" src={videoLogo} />
              </div>
              <label className="block">
                <span className="sr-only">Choose video photo</span>
                <input
                  onChange={handleFileChange}
                  type="file" className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "/>
              </label>
            </div>
            <div>
              {
                uploading && <Progress
                  hidden={uploading}
                  progress={progress}
                  textLabel="Uploading" size="lg" labelProgress labelText />
              }
            </div>

            <div>
              {
                message && (progress === 100 || !uploading) && (
                  <Alert color="success" rounded={true}
                    onDismiss={() => { setMessage(null); }}
                    withBorderAccent={true}

                  >
                    <span className="font-medium">Success alert!</span>{message}
                  </Alert>
                )
              }

            </div>

            <div className='flex justify-center'>
              <Button
                disabled={uploading}
                type='submit'>
                Upload Video
              </Button>
            </div>
          </form>

        </div>
      </Card >



    </div >
  )
}

export default VideoUpload
