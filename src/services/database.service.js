import { getDatabase, ref, set, onDisconnect, onValue, onChildAdded, onChildChanged, push, onChildRemoved, get } from "firebase/database";

import app from './firebase.config'

const db = getDatabase(app);


export function addUserToChannel(channelId, user){
    const userOnlineRef = ref(db, `channels/${channelId}/users/${user.id}`)

    set(userOnlineRef, user);

    onDisconnect(userOnlineRef).remove();
}

export function getChannels(callback){
    get(ref(db, `channels`)).then((snapshot) => {
        if(snapshot.exists()){
            const channelList = Object.keys(snapshot.val()).map(id => ({...snapshot.val()[id],id}))
            callback(channelList)
        }
    })
}

export function ListenerChannels({onAdded, onChanged, onRemoved}){
    const connectionsPath = `channels`;
    const userOnChannelRef = ref(db, connectionsPath)
    
    onChildAdded(userOnChannelRef, (data) => {
        const newChannel = {
            [data.key]: {
                id: data.key,
                ...data.val(),
            }
        }
        onAdded(newChannel)
    })

    onChildChanged(userOnChannelRef, (data) => {
        const newChannel = {
            [data.key]: {
                id: data.key,
                ...data.val(),
            }
        }
        onChanged(newChannel)
    });

    onChildRemoved(userOnChannelRef, (data) => {
        onRemoved(data.val())
    });
}

export function ListenerConnections(channelId, userId, onAdded){
    const connectionsPath = `channels/${channelId}/users/${userId}/connections`;
    const userOnChannelRef = ref(db, connectionsPath)
    
    onChildAdded(userOnChannelRef, (data) => {
        onAdded(data.val())
    })
}

export function sendConnection(channelId, receptorId ,connection){  
    console.log('sendConnection ', connection.candidate)
    const connectionRef = ref(db, `channels/${channelId}/users/${receptorId}/connections/${connection.connectionId}`)
    set(connectionRef, connection);      
}

export function sendAnswer(channelId, connection){
    const destinationRef = ref(db, `channels/${channelId}/users/${connection.offerId}/connections/${connection.connectionId}`)

    set(ref(db, destinationRef), connection);   
}

