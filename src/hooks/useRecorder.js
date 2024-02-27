import { useEffect, useState } from "react"
import { StopStream, getStream, getSuportedMedia } from "../utils/mediaRecorder.utils";

const mediaSuported = getSuportedMedia();   

const initialSuportedMedia = {
    videoType: mediaSuported.videoTypes[0],
    videoCodec: mediaSuported.videoCodecs[0],
    audioCodec: mediaSuported.audioCodecs[0] 
}

const initialStreamOptions = {
    micAudio: true, 
    screenCapture: false, 
    screenAudio: true, 
    userCam: false
}

const useTimer = (isRecording) => {
    const [initialTime, setInitialTime] = useState(0);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if(!isRecording) return;

        setInitialTime(Date.now());

        const timer = setInterval(() => {
            const current = initialTime - Date.now();
            setTime(current);
        },1000);

        return () => {
            clearInterval(timer);
        }
    },[isRecording])

    const resetTimer = () => {
        setTime(0);
        setInitialTime(0);
    }

    return {initialTime, time, resetTimer}
}

const useRecorder = () => {
    
    const [streamOptions, setStreamOptions] = useState(initialStreamOptions);    
    const [mediaOptions, setMediaOptions] = useState(initialSuportedMedia);    
    
    const [mediaRecorder, setMediaRecorder] = useState(null);    
    const [startTime, setStartTime] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [stream, setStream] = useState(null);   
    const [blobUrl, setBlobUrl] = useState('');

    const {time, resetTimer} = useTimer(isRecording);

   
    var chunks = [];

    useEffect(() => {
        const preferences = localStorage.getItem('recorderSettings');
        if(preferences){
            const recorderSettings = JSON.parse(preferences);
            setMediaOptions(prev => ({...prev, ...recorderSettings}))
        } 
    },[])    
    
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
     * @param {Object} newStreamOptions Opções do vídeo
     * @param {boolean?} newStreamOptions.screenCapture Gravação de tela
     * @param {boolean?} newStreamOptions.screenAudio Captura de audio do sistema
     * @param {boolean?} newStreamOptions.userCam Captura de video da camera
     * @param {boolean?} newStreamOptions.micAudio Captura da audio do microfone 
     */
    const configureStream = async (newStreamOptions) => {
        if(stream){
            StopStream(stream)
        }
        const newStream = await getStream({...streamOptions, ...newStreamOptions});
        if(newStream != stream){
            newStream.getVideoTracks()
            .forEach(track => track.onended = ()=> {
                setStream(null);
                setStreamOptions(prev => ({...prev, screenCapture: false, userCam: false}))
            })
        }
        setStream(newStream || null)
        setStreamOptions({...streamOptions, ...newStreamOptions});        
    } 

    const start = () => {
        const {videoType, videoCodec, audioCodec} = mediaOptions; 

        const definitions = {
            mimeType: `video/${videoType};codecs=${videoCodec},${audioCodec}`
        }  
        
        const recorder = new MediaRecorder(stream, definitions);
        recorder.start();
        
        stream.getTracks().forEach(track => { track.onended = () => stop() })

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);

                const blob = new Blob(chunks, { type: definitions.mimeType });
               
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
            mediaRecorder?.stream?.getTracks()?.forEach(track => track.stop());
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

    const remove = () => {
        setBlobUrl(null);
        resetTimer();
    }    

    return {
        start, 
        stop,
        remove, 
        configureMedia, 
        configureStream,
        openInNewTab,
        stream, 
        mediaOptions,    
        streamOptions , 
        recordingTime: time , 
        isRecording,         
        blobUrl, 
        mediaSuported
    }
}

export default useRecorder