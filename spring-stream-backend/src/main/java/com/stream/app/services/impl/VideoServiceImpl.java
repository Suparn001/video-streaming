package com.stream.app.services.impl;

import com.stream.app.entities.Video;
import com.stream.app.repository.VideoRepository;
import com.stream.app.services.VideoService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {

    @Value("${file.video.normal}")
    String DIR;

    @Value("${file.video.hsl}")
    String HSL_DIR;

    private VideoRepository videoRepository;

    public VideoServiceImpl(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }


    @PostConstruct
    public void init() {
        File file = new File(DIR);

//        File file1 = new File(HSL_DIR);
//        if(!file.exists()) {
//            file1.mkdir();
//        }
        // alternate way to create directory
        try {
            Files.createDirectories(Paths.get(HSL_DIR));
            System.out.println("HSL Folder Created");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        if (!file.exists()) {
            file.mkdir();
            System.out.println("Simple Folder Created");
        } else {
            System.out.println("Folder Already Exists");
        }
    }


    @Override
    public Video save(Video video, MultipartFile file) {

        try {
            // original file name
            String filename = file.getOriginalFilename();
            String contentType = file.getContentType();
            InputStream inputStream = file.getInputStream();

            // file path
            String cleanFileName = StringUtils.cleanPath(filename);

            //folder path: create
            String cleanFolder = StringUtils.cleanPath(DIR);

            //folder path with filename
            Path path = Paths.get(cleanFolder, cleanFileName);

            System.out.println(contentType);
            //System.out.println(inputStream);
            System.out.println(filename);
            System.out.println(path);

            // copy file to the folder
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

            // video meta data
            video.setContentType(contentType);
            video.setFilePath(path.toString());

            // processing video
            System.out.println(video);
            videoRepository.save(video);
            this.processVideo(video.getVideoId());

            //delete actual video file and entry from database also if exception

            // metadata save
            return video;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public Video get(String videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(() ->
                new RuntimeException("Video Not Found"));

        return video;
    }

    @Override
    public Video getByTitle(String title) {
        return null;
    }

    @Override
    public List<Video> getAll() {
        return videoRepository.findAll();
    }

    @Override
    public String processVideo(String videoId) {

        Video video = this.get(videoId);
        Path inputVideoPath = Paths.get(video.getFilePath());

        // Output directory: videos_hsl/{videoId}
        Path outputDir = Paths.get(HSL_DIR, videoId);

        try {
            // 1️⃣ Ensure output directory exists
            Files.createDirectories(outputDir);

            // 2️⃣ Docker-compatible paths
            String inputDir = inputVideoPath.getParent().toString().replace("\\", "/");
            String inputFile = inputVideoPath.getFileName().toString();
            String outputDirDocker = outputDir.toString().replace("\\", "/");

            // 3️⃣ FFmpeg Docker command
            List<String> command = List.of(
                    "docker", "run", "--rm",
                    "-v", inputDir + ":/input",
                    "-v", outputDirDocker + ":/output",
                    "jrottenberg/ffmpeg",
                    "-i", "/input/" + inputFile,
                    "-c:v", "libx264",
                    "-c:a", "aac",
                    "-f", "hls",
                    "-hls_time", "10",
                    "-hls_list_size", "0",
                    "-hls_segment_filename", "/output/segment_%3d.ts",
                    "/output/master.m3u8"
            );

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            // 4️⃣ Read FFmpeg logs
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg Docker failed with exit code " + exitCode);
            }

            return outputDir.resolve("master.m3u8").toString();

        } catch (Exception e) {
            throw new RuntimeException("Video Processing Failed", e);
        }
    }


}
