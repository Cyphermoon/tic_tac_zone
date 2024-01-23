import { firestoreDB } from "@/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { PlayerProps } from "./type"

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


