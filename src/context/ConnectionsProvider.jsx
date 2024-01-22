import React, { createContext, createRef, useEffect, useState } from "react";
import { Connection } from "../services/connections.service";

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
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [user, setUser] = useState({ name: "offer", id: 1 , image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357'});

  const createCall = (offerId, answerId, channelId) => {    
    const connection = new Connection("pc1", "pc2", channelId);
    
    const offerUser = { name: "offer", id: 1 , image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357'};
    
    connection.onConnect = () => {      
      console.log("connected to server");
      connection.chat.send(JSON.stringify({type: "metadata", data: offerUser}));
      setMessages([]);
    };

    connection.onMessage = (message) => {
      setMessages((previous) => [...previous, message]); // quando receber uma mensagem
    };

    connection.Call().then((offer) => {
      setMessages((previous) => [...previous, { message: offer }]); // adiciona a string de conexão do offer ao chat para ser copiada e utilizada no answer
      setConnections((previous) => [...previous, connection]); // adiciona a conaxão criada na lista de conexões
    });
  };

  const createAnswer = (sdp) => {
    const answerUser = { name: "answer", id: 2 , image: 'https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg'};
    setUser(answerUser)

    const connection = new Connection("pc1", "pc2");

    connection.onConnect = () => {
        connection.chat.send(JSON.stringify({type: "metadata", data: answerUser}));
        setMessages([]);
    };

    connection.ontrack = (stream) => {
      console.log("received track", stream?.getTracks().length);
    };

    connection.onMessage = (message) =>
      setMessages((previous) => [...previous, message]);

    connection.Answer(sdp).then((message) => {
      console.log("answer response =>>>>>", sdp);
      setMessages((previous) => [...previous, { message }]);
      setConnections((previous) => [...previous, connection]);
    });
  };

  const registerAnswer = (sdp) => {
    var connection = connections.find((item) => item.offerId == "pc1" && !item.peerConnection.remoteDescription);
    connection.RegisterAnswer(sdp);
  };

  const sendToChannel = (message) => {  
    setMessages((previous) => [...previous, { message, user, date: new Date().toISOString() }]);
    connections.forEach((conection) => {
        conection.sendMessage(message);
    });   
  };

  const sendMessageContact = (contactId, message) => {
    const contactConnection = connections.find(
      (item) => item.offerId === contactId || item.answerId == contactId
    );
    if (contactConnection) {
      const sendedMessage = contactConnection.sendMessage(message);
      setMessages((previous) => [...previous, sendedMessage]);
    }
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
        connections,
        updateLocalStream,
        messages,        
        channels,
        sendToChannel,
        sendMessageContact,
        createCall,
        createAnswer,
        registerAnswer,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};

export default ConnectionsProvider;
