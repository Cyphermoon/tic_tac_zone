import { firestoreDB } from "@/firebase"
import { FieldValue, serverTimestamp, collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore"
import { OnlineGameDataProps, PlayerProps } from "./type"


// Types
interface GameData {
    [key: string]: any;
}


// Functions


export  async function getUser(user: PlayerProps | { id: string }) {
    // Reference to the user document
    const userDocRef = doc(firestoreDB, "users", user.id)

    // Get the user document snapshot
    const userDocSnap = await getDoc(userDocRef)

    // Check if user exists
    if (userDocSnap.exists()) {
        // return user data if user exists
        return userDocSnap.data() as PlayerProps
    } else {
        // create user if user does not exist
        await setDoc(userDocRef, user)
        return user
    }
}

export async function updateOrGetGame(gameId: string, data: GameData = {}) {
    const gameDocRef = doc(firestoreDB, 'games', gameId);

    const docSnap = await getDoc(gameDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as OnlineGameDataProps
    }

    // Merge the provided data with the default game data
    const gameData = {
        createdAt: serverTimestamp(),
        ...data
    };
    try {
        await setDoc(gameDocRef, gameData, { merge: true });

    } catch (error) {
        throw new Error(`Error creating game: ${error}`)
    }
}

export async function createChat(chatId: string, participants: string[]) {
    const chatDocRef = doc(firestoreDB, 'chats', chatId);

    // Create chat document
    await setDoc(chatDocRef, {
        participants: participants,
        timestamp: serverTimestamp()
    });
}