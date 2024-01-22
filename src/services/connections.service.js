var configuration = { 'iceServers': [{ urls: 'stun:23.21.150.121' }] }

export class Connection {
    constructor(offerId, answerId, channelId) {  
        this.channelId = channelId || Math.random() * 1000000;
        this.offerId = offerId; // id do offer, (quem inicia a chamada)
        this.answerId = answerId; // id do answer, (quem recebe a chamada)
        this.remoteUser = null; //dados do usuário remoto, enviado na primeira mensagem como metadata
        this.remoteStream = new MediaStream(); // objeto stream remoto, utilizado para apresentar o video recebido na tela
        this.chat = null; // canal de contato, evento send envia uma mensagem para o usuario remoto
        this.peerConnection = new RTCPeerConnection(configuration); // criação da conexão
        this.onMessage = () => { } // evento chamado quando recebe uma mensagem
        this.onConnect = () => { } // chama quando conexão está estabelecida 
        this.ontrack = () => { } // chama quando recebe um track de audio ou video
    }

    //offer configuration ----------------------------------------------------
    Call(stream) {
        return new Promise(async (resolve, reject) => {
            
            if(stream){
                this.localStream = stream;
                this.peerConnection.addStream(stream); 
            }
            
            this.peerConnection.onnegotiationneeded = () => {console.log('renegocie agora', this.peerConnection.localDescription)}

            this.peerConnection.ontrack = (e) => {
                this.remoteStream = e.streams[0];
                this.ontrack(e.streams[0]);
            }
            
            this.chat = this.peerConnection.createDataChannel('chat', { reliable: true });

            this.chat.onopen = () => {
                console.log('data channel connected', this.peerConnection);               
                this.onConnect(true)
            }

            this.chat.onmessage = (e) => {
                console.log('on message receive', e)
                const response = JSON.parse(e.data);
                if (response?.type == 'metadata') {
                    this.remoteUser = response.data;
                } else {                   
                    this.onMessage({ ...response, user: this.remoteUser})
                }
            }

            var timeId = 0;

            this.peerConnection.onicecandidate = (e) => {
                console.log('icecandidate ', e)

                var currentTimeId = Math.random() * 1000;
                timeId = currentTimeId;

                setTimeout(() => {
                    if (timeId == currentTimeId && e.candidate != null)
                        resolve(JSON.stringify(this.peerConnection.localDescription));
                }, 300)
            }

            this.peerConnection.createOffer()
                .then(description => this.peerConnection.setLocalDescription(description));
        })
    }

    RegisterAnswer(sdp) {
        this.peerConnection.setRemoteDescription(JSON.parse(sdp))
    }

    //answer configuration ----------------------------------------------------
    Answer(sdp, stream) {
        return new Promise(async (resolve, reject) => {

           if(stream){               
               this.peerConnection.addStream(stream);
           }

            // this.peerConnection.ontrack = (e) => {
            //     this.remoteStream = e.streams[0];
            //     this.ontrack(e.streams[0]);
            // }

            this.peerConnection.ondatachannel = (e) => {
                this.chat = e.channel;
                this.chat.onopen = () => {
                    console.log('data channel connected', this.peerConnection);
                    this.onConnect(true);
                }

                this.chat.onmessage = (e) => {
                    console.log('on message receive', e)
                    const response = JSON.parse(e.data);
                    if (response?.type == 'metadata') {
                        this.remoteUser = response.data;
                    } else {
                        console.log('receivet message =>> ',{ ...response.data, user: this.remoteUser})
                        this.onMessage({...response, user: this.remoteUser})
                    }
                }
            }

            var timeId = 0;

            this.peerConnection.onicecandidate = (e) => {
                console.log('create candidate')
                var currentTimeId = Math.random() * 1000;
                timeId = currentTimeId;

                setTimeout(() => {
                    if (timeId == currentTimeId && timeId != null) {
                        resolve(JSON.stringify(this.peerConnection.localDescription))
                        timeId = null;
                    }
                }, 300);
            }

            this.peerConnection.setRemoteDescription(JSON.parse(sdp));

            this.peerConnection.createAnswer().then(description => {
                this.peerConnection.setLocalDescription(description);
            })
        })
    }


    //end connection 

    sendMessage(message) {
        const newMessage = {
            type: 'message',
            message,
            date: new Date().toISOString()            
        }

        this.chat.send(JSON.stringify(newMessage));
    }
}