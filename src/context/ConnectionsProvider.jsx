import React, {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Connection } from "../services/connections.service";
import {
  addConnectionOnChannel, 
} from "../services/firestore.service";
import { AuthContext } from "./AuthProvider";
import {
  ListenerChannels,
  ListenerConnections,
  addUserToChannel,
  sendConnection,
} from "../services/database.service";

export const ConnectionsContext = createContext();
ConnectionsContext.displayName = "Connections webRTC";

const ConnectionsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [localStream, setLocalStream] = useState(null);
  const [localStreamPreview, setLocalStreamPreview] = useState(null);
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState({});
  const [currentChannel, setCurrentChannel] = useState(null);
  const [newConnection, setNewConnection] = useState(null);

  useEffect(() => {
    ListenerChannels({
      onAdded: (channel) =>
        setChannels((previous) => ({ ...previous, ...channel })),
      onChanged: (channel) =>
        setChannels((previous) => ({ ...previous, ...channel })),
      onRemoved: (channel) =>
        setChannels((previous) => ({ ...previous, ...channel })),
    });

    return () => {};
  }, []);

  useEffect(() => {   
    if(currentChannel){
      ListenerConnections(currentChannel.id, user.id, (connection) => {
        setNewConnection(connection)      
      });    
      sendOfferToChannel(currentChannel);
    }
  }, [currentChannel]);

  useEffect(() => {   
    if(newConnection){
      checkNewConnection({...newConnection}, connections)
    }
  }, [newConnection]);

  const joinChannel = (channel) => {
    addUserToChannel(channel.id, user);
    setCurrentChannel(channel);    
  };

  const sendOfferToChannel = async (channel) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    setLocalStream(stream);

    const users = Object.values(channel?.users || {}).filter(
      (item) => item.id != user.id
    );

    users.forEach((answerUser) => {
      createCall(answerUser.id, stream).then(({ connection, candidate }) => {
        const connectionObject = {
          candidate: JSON.stringify(candidate),
          connectionId: connection.id,
          offerId: connection.offerId,
          answerId: connection.answerId,
        };

        if (
          !connection.chat ||
          connections.some((item) => item.id == connection.id)
        )
          return;

        setConnections((previous) => [...previous, connection]);
        sendConnection(channel.id, connectionObject.answerId ,connectionObject);
      });
    });
  };

  const checkNewConnection = (connection, connectionList) => {  
    const { connectionId, candidate } = connection;
    const candidateObject = JSON.parse(candidate);

    if(candidateObject.type == 'offer') {
      const myConnection = connections.find(cn => cn.id == connectionId);
      if (myConnection) return;

      createAnswer({ ...connection, candidate: candidateObject }).then(({ answerConnection, answerCandidate }) => {
        const connectionObject = {
          candidate: JSON.stringify(answerCandidate),
          connectionId: answerConnection.id,
          offerId: answerConnection.offerId,
          answerId: answerConnection.answerId,
        }
        setConnections((previous) => [...previous, answerConnection]);
        sendConnection(currentChannel.id, answerConnection.offerId, connectionObject);
      })
    }
   
    if (candidateObject.type == "answer"){
      const localConnetion = connectionList.find(
        (item) => item.id == connection.connectionId
        );
        console.log('read answer =>> ', connectionList)
  
      if ( localConnetion && !localConnetion.peerConnection.remoteDescription) {
        localConnetion.peerConnection.setRemoteDescription(candidateObject);
      }
    }
    
  };

  const createCall = (answerId, stream, connectionId) => {
    return new Promise(async (resolve, reject) => {
      const connection = new Connection(user.id, answerId, connectionId);

      connection.onConnect = () => {
        console.log("connected to server");
        connection.sendMessage("", { type: "metadata", user });
      };

      connection.onMessage = (message) => {
        setMessages((previous) => [...previous, message]); // quando receber uma mensagem
      };

      connection.Start(null, stream).then((candidate) => {
        resolve({ connection, candidate });
      });
    });
  };

  const createAnswer = (connectionOffer) => {
    return new Promise((resolve, reject) => {
      const { candidate, connectionId, offerId } = connectionOffer;

      const connection = new Connection(offerId, user.id, connectionId);

      connection.onConnect = () => {
        connection.sendMessage("", { type: "metadata", user });
      };

      connection.ontrack = (stream) => {
        console.log("received track", stream?.getTracks().length);
      };

      connection.onMessage = (message) =>
        setMessages((previous) => [...previous, message]);

      connection.Start(candidate, localStream).then((candidate) => {
        resolve({ answerConnection: connection, answerCandidate: candidate });
      });
    });
  };

  const registerAnswer = (connectionString) => {
    const { candidate, connectionId } = JSON.parse(connectionString);

    var connection = connections.find((item) => item.id == connectionId);
    connection.Start(candidate);
  };

  const sendToChannel = (message) => {
    setMessages((previous) => [
      ...previous,
      { message, user, date: new Date().toISOString() },
    ]);
    connections.forEach((conection) => {
      conection.sendMessage(message);
    });
  };

  const updateLocalStream = (stream) => {
    connections.forEach((connection) => {
      stream.getTracks().forEach((track) => {
        connection.peerConnection.addTrack(track, stream);
      });
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
