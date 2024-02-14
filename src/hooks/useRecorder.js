import { useEffect, useState } from "react"
import { getStream, getSuportedMedia } from "../utils/mediaRecorder.utils";

const mediaSuported = getSuportedMedia();   

const initialSuportedMedia = {
    videoType: mediaSuported.videoTypes[0],
    videoCodec: mediaSuported.videoCodecs[0],
    audioCodec: mediaSuported.audioCodecs[0] 
}

const initialStreamOptions = {
    micAudio: true, 
    screenCapture: true, 
    screenAudio: true, 
    userCam: false
}

const useRecorder = () => {
    
    const [streamOptions, setStreamOptions] = useState(initialStreamOptions);    
    const [mediaOptions, setMediaOptions] = useState(initialSuportedMedia);    
    
    const [mediaRecorder, setMediaRecorder] = useState(null);    
    const [startTime, setStartTime] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const [blob, setBlob] = useState(null);
    const [blobUrl, setBlobUrl] = useState('');

    var intervalID;
    var chunks = [];

    useEffect(() => {
        const preferences = localStorage.getItem('recorderSettings');
        if(preferences){
            const recorderSettings = JSON.parse(preferences);
            setMediaOptions(prev => ({...prev, ...recorderSettings}))
        } 
    },[])

    useEffect(() => {
        if(isRecording) {
            intervalID = setInterval(() => {
                setRecordingTime(startTime - Date.now());
            },1000)
        } else {
            setRecordingTime(0);
            clearInterval(intervalID);
        }
    },[isRecording])  

    
    /**
     * @param {Object} videoOptions Opções do vídeo
     * @param {string} videoOptions.videoType Tipo do vídeo
     * @param {string} videoOptions.videoCodec Códec do vídeo
     * @param {string} videoOptions.audioCodec Códec de áudio
     */
    const configureMedia = (videoOptions) => {
        setMediaOptions(prev => {
            const newVideoOptions = {...prev, ...videoOptions}
            localStorage.setItem('recorderSettings', JSON.stringify(newVideoOptions));
            return newVideoOptions;
        })
    }  
    

    /**
     * @param {Object} streamOptions Opções do vídeo
     * @param {boolean} streamOptions.screenCapture Gravação de tela
     * @param {boolean} streamOptions.screenAudio Captura de audio do sistema
     * @param {boolean} streamOptions.userCam Captura de video da camera
     * @param {boolean} streamOptions.micAudio Captura da audio do microfone 
     */
    const configureStream = (streamOptions) => {
        setStreamOptions(prev => ({...prev, ...streamOptions}))
    }   

    const start = () => {
        const {videoType, videoCodec, audioCodec} = mediaOptions; 

        const definitions = {
            mimeType: `video/${videoType};codecs=${videoCodec},${audioCodec}`
        }        

        const stream = getStream(streamOptions);
        
        const recorder = new MediaRecorder(stream, definitions);
        recorder.start();
        
        stream.getTracks().forEach(track => { track.onended = () => stop() })

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);

                const blob = new Blob(chunks, { type: definitions.mimeType });

                setBlob(blob);
                setBlobUrl(URL.createObjectURL(blob))              
            } else {
                // …
            }
        }

        recorder.onstart = () => {
            setStartTime(Date.now());
            setIsRecording(true);
        }

        recorder.onstop = () => {
            setIsRecording(false);
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setMediaRecorder(null);
        }

        setMediaRecorder(recorder);
    }

    const stop = () => {
        if(mediaRecorder && isRecording){
            mediaRecorder.stop();
        }
    }

    const openInNewTab = () => {
        if(blobUrl)
            window.open(blobUrl);
    }   

    

    return {
        start, 
        stop, 
        configureMedia, 
        configureStream, 
        mediaOptions,    
        streamOptions , 
        recordingTime , 
        isRecording, 
        blob, 
        blobUrl, 
        mediaSuported
    }
}

export default useRecorder