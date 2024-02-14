const VIDEO_TYPES = ['webm', 'x-matroska', 'mp4', 'ogg', 'mpeg'];
const AUDIO_TYPES = ['x-matroska', 'webm', 'mp3', 'mp4', 'ogg', 'wav'];

const VIDEO_CODECS = ['h264', 'h.264', 'h265', 'h.265', 'avc1',  'av1', 'mpeg', 'vp9', 'vp9.0', 'vp8', 'vp8.0', 'theora'];
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

   return { videoTypes, videoCodecs, audioCodecs}
}

export function getMediaExtensionByType(type){
    return type === 'x-matroska'? 'mkv' : type;
}

/**
 * @param {Object} mediaStreams Opções do vídeo
 * @param {boolean} mediaStreams.micAudio Tipo do vídeo
 * @param {boolean} mediaStreams.screenAudio Códec do vídeo
 * @param {'user' | 'screen'} mediaStreams.camera Códec de áudio
 */
export function getStream({micAudio, screenAudio , camera }){

    return new Promise((resolve, reject) => {
        var screenConstraints = { video: true, audio: true };
        navigator.mediaDevices.getDisplayMedia(screenConstraints).then(function (screenStream) {
            /* use the screen & audio stream */
            var micConstraints = { audio: true };
            navigator.mediaDevices.getUserMedia(micConstraints).then(function (micStream) {
                /* use the microphone stream */

                //create a new stream in which to pack everything together
                var composedStream = new MediaStream();

                //add the screen video stream
                screenStream.getVideoTracks().forEach(function (videoTrack) {
                    composedStream.addTrack(videoTrack);
                });

                //create new Audio Context
                var context = new AudioContext();

                //create new MediaStream destination. This is were our final stream will be.
                var audioDestinationNode = context.createMediaStreamDestination();

                //check to see if we have a screen stream and only then add it
                if (screenStream && screenStream.getAudioTracks().length > 0) {
                    //get the audio from the screen stream
                    const systemSource = context.createMediaStreamSource(screenStream);

                    //set it's volume (from 0.1 to 1.0)
                    const systemGain = context.createGain();
                    systemGain.gain.value = 1.0;

                    //add it to the destination
                    systemSource.connect(systemGain).connect(audioDestinationNode);

                }

                //check to see if we have a microphone stream and only then add it
                if (micStream && micStream.getAudioTracks().length > 0) {
                    //get the audio from the microphone stream
                    const micSource = context.createMediaStreamSource(micStream);

                    //set it's volume
                    const micGain = context.createGain();
                    micGain.gain.value = 1.0;

                    //add it to the destination
                    micSource.connect(micGain).connect(audioDestinationNode);
                }

                //add the combined audio stream
                audioDestinationNode.stream.getAudioTracks().forEach(function (audioTrack) {
                    composedStream.addTrack(audioTrack);
                });

                //pass over to function that shows the stream and activates the recording controls
                resolve(composedStream)

            }).catch(function (err) {
                console.log(err);
                document.getElementById("error").innerHTML = "You need a microphone to run the demo";
            });
        }).catch(function (err) {
            console.log(err);
            document.getElementById("error").innerHTML = "You need to share your screen to run the demo";
        });
    })
}
