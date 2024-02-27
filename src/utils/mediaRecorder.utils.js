const VIDEO_TYPES = ['webm', 'x-matroska', 'mp4', 'ogg', 'mpeg'];
const AUDIO_TYPES = ['x-matroska', 'webm', 'mp3', 'mp4', 'ogg', 'wav'];

const VIDEO_CODECS = ['h264', 'h.264', 'h265', 'h.265', 'avc1', 'av1', 'mpeg', 'vp9', 'vp9.0', 'vp8', 'vp8.0', 'theora'];
const AUDIO_CODECS = ['opus', 'vorbis', 'aac', 'mpeg', 'mp4a', 'pcm'];

const testType = (mimeType) => {
    if (MediaRecorder.isTypeSupported(mimeType)) {
        return true;
    } else {
        return false
    }
};

/**
 * @returns {{videoTypes: string[], videoCodecs: string[], audioCodecs: string[]}}
 */

export function getSuportedMedia() {
    const videoTypes = VIDEO_TYPES.filter(type => testType(`video/${type}`));
    const videoCodecs = VIDEO_CODECS.filter(videoCodec => testType(`video/${videoTypes[0]};codecs=${videoCodec}`));
    const audioCodecs = AUDIO_CODECS.filter(audioCodec => testType(`video/${videoTypes[0]};codecs=${videoCodecs[0]},${audioCodec}`));

    return { videoTypes, videoCodecs, audioCodecs }
}

export function getMediaExtensionByType(type) {
    return type === 'x-matroska' ? 'mkv' : type;
}

/**
 * @param {Object} streamOptions Opções do vídeo
 * @param {boolean} streamOptions.screenCapture Gravação de tela
 * @param {boolean} streamOptions.screenAudio Captura de audio do sistema
 * @param {boolean} streamOptions.userCam Captura de video da camera
 * @param {boolean} streamOptions.micAudio Captura da audio do microfone 
 * @returns {Promise<MediaStream>}
 */
export function getStream({ micAudio, screenAudio, userCam, screenCapture }) {
    if (screenCapture) {
        return getScreenWithMicAndAudio(screenAudio, micAudio)
    } else if (userCam) {
        return navigator.mediaDevices.getUserMedia({ audio: micAudio, video: true })
    }
}

/** 
 * @param {MediaStream} stream MediaStream 
 */
export function StopStream(stream){
    stream.getTracks().forEach(track => track.stop());
}

function getScreenWithMicAndAudio(screenAudio, micAudio) {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: screenAudio })
            .then(function (screenStream) {

                if (!micAudio)
                    return resolve(screenStream);
                
                navigator.mediaDevices.getUserMedia({ audio: micAudio }).then(function (micStream) {
                   
                    var composedStream = new MediaStream();
                   
                    screenStream.getVideoTracks().forEach(function (videoTrack) {
                        composedStream.addTrack(videoTrack);
                    });
                   
                    var context = new AudioContext();
                   
                    var audioDestinationNode = context.createMediaStreamDestination();
                   
                    if (screenStream && screenStream.getAudioTracks().length > 0) {                    
                        const systemSource = context.createMediaStreamSource(screenStream);
                       
                        const systemGain = context.createGain();
                        systemGain.gain.value = 1.0;
                      
                        systemSource.connect(systemGain).connect(audioDestinationNode);
                    }
                   
                    if (micStream && micStream.getAudioTracks().length > 0) {                      
                        const micSource = context.createMediaStreamSource(micStream);
                      
                        const micGain = context.createGain();
                        micGain.gain.value = 1.0;
                    
                        micSource.connect(micGain).connect(audioDestinationNode);
                    }
                  
                    audioDestinationNode.stream.getAudioTracks().forEach(function (audioTrack) {
                        composedStream.addTrack(audioTrack);
                    });
                   
                    resolve(composedStream)

                }).catch(function (err) {
                    console.error(err);
                });
            }).catch(function (err) {
                console.error(err);
            });
    })
}
