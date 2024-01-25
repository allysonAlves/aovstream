import React, { createContext, createRef, useContext, useEffect, useState } from "react";
import { Connection } from "../services/connections.service";
import { ListenerServer, addConnectionOnChannel, addUserOnChannel, getChannels, updateConnectionOnChannel } from "../services/firestore.service";
import { AuthContext } from "./AuthProvider";

export class StreamVideo extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  render() {
    return <video width={320} height={180} autoPlay ref={this.videoRef} />;
  }

  componentDidMount() {
    this.updateVideoStream();
  }

  componentDidUpdate() {
    this.updateVideoStream();
  }

  updateVideoStream() {
    if (this.videoRef.current.srcObject !== this.props.stream) {
      this.videoRef.current.srcObject = this.props.stream;
    }
  }
}

export const ConnectionsContext = createContext();

const ConnectionsProvider = ({ children }) => {
  const {user} = useContext(AuthContext);  
  const [localStream, setLocalStream] = useState(null);  
  const [localStreamPreview, setLocalStreamPreview] = useState(null);  
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);  

  useEffect(() => {
    const unsubscribe = ListenerServer((resp) => {      
      setChannels(resp);
    })  

    return () => {
      unsubscribe();
    }
  }, [])

  useEffect(() => {
    console.log('current channel', currentChannel)
    if(currentChannel){
      checkNewConnections(channels.find(channel => channel.id == currentChannel.id));
    }  
  }, [channels])
  

  const joinChannel = (channel) => {    
    addUserOnChannel(user, channel.id).then(() => {      
      setCurrentChannel(channel);
      sendOfferToChannel(channel);     
    })
  }

  const sendOfferToChannel = async (channel) => {  
    const stream = await navigator.mediaDevices.getUserMedia({audio: true,video:false});
    setLocalStream(stream);

    const users = channel.users.filter(item => item.id != user.id);

    users.forEach(channelUser => {
      createCall(channelUser.id, stream).then(({connection, candidate}) => {
        const connectionObject = {
          candidate: JSON.stringify(candidate), 
          connectionId: connection.id, 
          offerId:connection.offerId, 
          answerId: connection.answerId
        }
        
        setConnections((previous) => [...previous, connection]);
        addConnectionOnChannel(connectionObject, channel);
      })          
    })
  }

  const checkNewConnections = (channel) => {
    console.log(channel.connections)
    Object.values(channel.connections).forEach(connection => { 
      const {offerId, answerId, connectionId, candidate} = connection;    

      const candidateObject = JSON.parse(candidate);

      if(offerId == user.id){
        if(candidateObject.type != 'answer') return;

        const localConnetion = connections.find(item => item.id == connection.connectionId);
        console.log(user.name, 'connectionid ==' + connectionId, candidateObject)
        if(localConnetion){
          localConnetion.peerConnection.setRemoteDescription(candidateObject);
        }

        return;
      }

      if(answerId == user.id){ 
        if(candidateObject.type != 'offer') return;

        const existentConnection = connections.find(item => item.id == connectionId);

        if(existentConnection)
          return existentConnection.peerConnection.setRemoteDescription(candidateObject);          

        createAnswer({...connection, candidate: candidateObject}).then(({answerConnection, answerCandidate}) =>{
          const answerConnectionObject = {
            candidate: JSON.stringify(answerCandidate), 
            connectionId: answerConnection.id, 
            offerId:answerConnection.offerId, 
            answerId: answerConnection.answerId
          }

          setConnections((previous) => [...previous, answerConnection]);
          addConnectionOnChannel(answerConnectionObject, channel);
        })
        
      }
    })   
    
  }
  
  const createCall = (answerId, stream ,connectionId) => {    
    return new Promise( async (resolve, reject) => {
      const connection = new Connection(user.id, answerId, connectionId);
      
      connection.onConnect = () => {      
        console.log("connected to server");
        connection.sendMessage('',{type: "metadata", user});        
      };
  
      connection.onMessage = (message) => {
        console.log('call message init')
        setMessages((previous) => [...previous, message]); // quando receber uma mensagem
      };    
      
      connection.Start(null, stream).then((candidate) => {
       
        resolve({connection, candidate})   
      });
    })
  };

  const createAnswer = (connectionOffer) => { 
    return new Promise((resolve, reject) => {
      const {candidate, connectionId, offerId} = connectionOffer;
  
      const connection = new Connection(offerId, user.id, connectionId);
  
      connection.onConnect = () => {
        connection.sendMessage('',{type: "metadata", user});       
      };
  
      connection.ontrack = (stream) => {
        console.log("received track", stream?.getTracks().length);
      };
  
      connection.onMessage = (message) =>
        setMessages((previous) => [...previous, message]);
      
        console.log(localStream.getTracks().length, 'TRACKSSSSS')
      connection.Start(candidate, localStream).then((candidate) => {       
        resolve({answerConnection: connection, answerCandidate: candidate})       
      });
    })
  };

  const registerAnswer = (connectionString) => {
    const {candidate, connectionId} = JSON.parse(connectionString);
    console.log(candidate)
    var connection = connections.find((item) => item.id == connectionId );
    connection.Start(candidate);
  };

  const sendToChannel = (message) => {  
    setMessages((previous) => [...previous, { message, user, date: new Date().toISOString() }]);
    connections.forEach((conection) => {
        conection.sendMessage(message);
    });   
  };

  const updateLocalStream = (stream) => {
    connections.forEach((connection) => {        
      stream.getTracks().forEach((track) => {
        connection.peerConnection.addTrack(track, stream);
      })
    });
  };

  return (
    <ConnectionsContext.Provider
      value={{
        currentChannel,
        connections,
        messages,        
        channels,
        localStream,
        joinChannel,
        sendToChannel,
        createCall,
        createAnswer,
        registerAnswer,
        updateLocalStream,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};

export default ConnectionsProvider;
