export class AOVMediaRecorder {
    constructor() {
        this.mediaRecorder = new MediaRecorder(new MediaStream());
    }

    start(startCalback, stopCallback) {
       

        const options = {
            mimeType: `video/${videoType[0]};codecs=${videoCodec[0]},${audioCodec[0]}`,
            videoExtension: videoType[0]
        }


        console.log(options.mimeType)

        getRecordStream().then(stream => {
            var chunks = [];
            var startTime;

            this.mediaRecorder = new MediaRecorder(stream, options); // {mimeType: 'video/webm'}

            console.log(this.mediaRecorder.audioBitsPerSecond)

            stream.getTracks().forEach(track => { track.onended = () => this.stop() })

            this.mediaRecorder.ondataavailable = handleDataAvailable;
            this.mediaRecorder.onstart = startCalback;
            this.mediaRecorder.onstop = () => {
                stopCallback();
                this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            };

            startTime = Date.now();
            this.mediaRecorder.start();

            function handleDataAvailable(event) {
                console.log("data-available");
                if (event.data.size > 0) {
                    chunks.push(event.data);
                    console.log(chunks);
                    download();
                } else {
                    // …
                }
            }

            async function download() {
                const duration = Date.now() - startTime;

                const blob = new Blob(chunks, {
                    type: options.mimeType,
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `video_with_metadata.${options.videoExtension}`;
                a.click();
                URL.revokeObjectURL(url);

            }
        })
            .catch(err => console.error(err));
    }

    stop() {
        this.mediaRecorder.stop();

    }
}

function getRecordStream() {
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