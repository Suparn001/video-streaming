import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import Hls from 'hls.js'
import "video.js/dist/video-js.css"
import { Toast } from 'flowbite-react'
import { ToastContainer, toast } from 'react-toastify';

const VideoPlayer = ({ src }) => {

    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // for init
        playerRef.current = videojs(videoRef.current, {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            muted: true,
            preload: "auto"
        });
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current.play();
            })
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = src;
            videoRef.current.addEventListener("canplay", () => {
                videoRef.current.play();
            })
        } else {
            console.log("video format not formated");
            toast.error("Video format ot supported");
        }
    }, [src]);

    return (
        <div>
            <div data-vjs-player>
                <video
                    ref={videoRef}
                    style={{
                        width: "500px",
                        height: "500px"
                    }}
                    className='video-js vjs-control-bar'
                >

                </video>
            </div>
        </div>
    )
}

export default VideoPlayer
