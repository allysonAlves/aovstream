import app from './firebase.config'
import { getFirestore, collection , addDoc, doc, setDoc, updateDoc ,deleteDoc, onSnapshot , getDoc, getDocs , where, query, orderBy, limit, arrayUnion} from 'firebase/firestore'

const db = getFirestore(app);

export async function Get(id){        
    return new Promise( async (resolve, reject) => {
        const result = getDoc(doc(db,'channels',id));
    
        if(result.exists())
        {
            resolve(result.data());
        }else
        {
            resolve(null);
        }  
    })
}

export async function getChannels(){  
    return new Promise((resolve, reject) => {
        getDocs(collection(db,'channels')).then(response => {
            const docs = response.docs.map(item => ({
                id:item.id,
                ...item.data()
            }));
            resolve(docs);
        }).catch(error => {
    
        })
        // resolve([{
        //         "id": "StjK70csDZt05F9kFdWr",
        //         "connections": [],
        //         "users": [{name: 'Allyson Alves'}],
        //         "name": "Daily - 9:15 am"
        //     }])
    })
}

export const addUserOnChannel = (user, channelId) => {
    const channelRef = doc(db, "channels", channelId);

    return updateDoc(channelRef, {
        users: arrayUnion(user)
    })
}

export const addConnectionOnChannel = (connectionObject, channel) => {
    const channelRef = doc(db, "channels", channel.id);

    const newObjectConnetions = {
            ...channel.connections,
            [connectionObject.connectionId]: connectionObject
        }
     
    console.log('objeto de retorno =>>', newObjectConnetions)
    return setDoc(channelRef, 
        {
           connections: newObjectConnetions
        }
    , { merge: true })
}
export const updateConnectionOnChannel = (connectionObject, channel) => {
    const channelRef = doc(db, "channels", channel.id);;
   
    return updateDoc(channelRef, {
           [`connections.${connectionObject.connetionId}`]: connectionObject
        })
}

export function ListenerServer(callback){
   return onSnapshot(collection(db, 'channels'),    
    (response) => {
        const result = [];
        response.forEach(item => result.push({id: item.id,...item.data()}));
        callback(result);
    });
} 

export function ListenerConnections(callback){
   return onSnapshot(collection(db, 'channels'),    
    (response) => {
        const result = [];
        response.forEach(item => result.push({id: item.id,...item.data()}));
        callback(result);
    });
} 