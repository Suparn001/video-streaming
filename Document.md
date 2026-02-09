**Document**:



Codec: method for encoding/decoding example: H.264, H.265



Container: file format that holds the video like .mp4, .avi



Bitrate: amount of data processed per second eg. kbps, mbps



Resolution: dimension of video example: 1920x1080 full hd





This provides us the compatibility, optimization, adaptive streaming(1080p, 720p,360p) based on internet speed





HLS -> HTTP Live Streaming



\- **Segmentation**: The video is divided into small segments, typically 2–10 seconds each.



\- **Master Playlist (.m3u8)**: A file that references different variant streams (quality levels) available for playback.



\- **Variant Playlists**: Each quality level has its own playlist, listing the URLs of the segments at that quality.



