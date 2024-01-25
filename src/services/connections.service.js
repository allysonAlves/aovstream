import { v4 as uuidv4 } from 'uuid';

var configuration = { 'iceServers': [{ urls: 'stun:23.21.150.121' }] }

const createOffer = (connection) => {
    return new Promise((resolve, reject) => {   
        connection.chat = connection.peerConnection.createDataChannel('chat', { reliable: true });
    
        connection.chat.onopen = () => {
            console.log('data channel connected', connection.peerConnection);               
            connection.onConnect(true)
        }
    
        connection.chat.onmessage = (e) =>
            configureMessage(connection, JSON.parse(e.data))        
    
        var timeId = 0;
    
        connection.peerConnection.onicecandidate = (e) => {
            console.log('icecandidate ', e)
    
            var currentTimeId = Math.random() * 1000;
            timeId = currentTimeId;
    
            setTimeout(() => {
                if (timeId == currentTimeId && e.candidate != null)
                    resolve(connection.peerConnection.localDescription);
            }, 300)
        }
    
        connection.peerConnection.createOffer()
            .then(description => connection.peerConnection.setLocalDescription(description));

    })
}

const createAnswer = (connection, candidate) => {    
    return new Promise(async (resolve, reject) => {

        connection.peerConnection.ondatachannel = (e) => {
            connection.chat = e.channel;
            connection.chat.onopen = () => {
                console.log('data channel connected', connection.peerConnection);
                connection.onConnect(true);
            }

            connection.chat.onmessage = (e) =>
                configureMessage(connection, JSON.parse(e.data));           
        }

        var timeId = 0;

        connection.peerConnection.onicecandidate = (e) => {
            console.log('create candidate')
            var currentTimeId = Math.random() * 1000;
            timeId = currentTimeId;

            setTimeout(() => {
                if (timeId == currentTimeId && timeId != null) {
                    resolve(connection.peerConnection.localDescription)
                    timeId = null;
                }
            }, 300);
        }

        connection.peerConnection.setRemoteDescription(candidate);

        connection.peerConnection.createAnswer().then(description => {
            connection.peerConnection.setLocalDescription(description);
        })
    })   
}

const configureMessage = (connection, data) => {
    console.log('data chegou aqui configure message =>>>> ', data.type)
    if(!data?.type) return;

    const options = {
        "metadata": () => connection.remoteUser = data.user,
        "message": () => connection.onMessage({...data, user: connection.remoteUser}),
        "update": () => connection.Update(data.message)
    }

    if(options[data.type]) options[data.type]();     
}

export class Connection {
    constructor(offerId, answerId, connectionId) {  
        this.id = connectionId || uuidv4();
        this.offerId = offerId; // id do offer, (quem inicia a chamada)
        this.answerId = answerId; // id do answer, (quem recebe a chamada)
        this.remoteUser = null; //dados do usuário remoto, enviado na primeira mensagem como metadata
        this.remoteStream = null; // objeto stream remoto, utilizado para apresentar o video recebido na tela
        this.chat = null; // canal de contato, evento send envia uma mensagem para o usuario remoto
        this.peerConnection = new RTCPeerConnection(configuration); // criação da conexão
        this.onMessage = () => { } // evento chamado quando recebe uma mensagem
        this.onConnect = () => { } // chama quando conexão está estabelecida 
        this.ontrack = () => { } // chama quando recebe um track de audio ou video
    }

    //offer configuration ----------------------------------------------------
    Start(candidate, stream) {
        return new Promise(async (resolve, reject) => {            
            if(stream){        
                stream.getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, stream); 
                    console.log('------------ tem track ---------------')
                })        
            }

            this.peerConnection.ontrack = (e) => {
                this.remoteStream = e.streams[0];
                this.ontrack(e.streams[0]);
            }

            this.peerConnection.onnegotiationneeded = () => {                
                if(this.peerConnection.remoteDescription)
                    this.sendMessage(this.peerConnection.localDescription, {type: 'update'})                
            }

            if(!candidate){
               resolve(await createOffer(this));               
            } 

            if(candidate?.type == 'offer'){
                resolve(await createAnswer(this, candidate));
                console.log('config candidate type offer call answer', candidate)
            }

            if(candidate?.type == 'answer') {
                if(!this.peerConnection.remoteDescription)
                    this.peerConnection.setRemoteDescription(candidate)
                resolve(true)
            }  
        })
    }

    Update(candidate){
        this.peerConnection.addIceCandidate(candidate);        
    }
    
    //end connection 

    sendMessage(message, options) {
        const newMessage = {
            type: options?.type || 'message',
            message,
            user: options?.user || null,
            date: new Date().toISOString()            
        }

        this.chat.send(JSON.stringify(newMessage));
    }
}