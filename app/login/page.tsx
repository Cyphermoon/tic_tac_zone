"use client"
import { useCurrentPlayer } from "@/components/Home/store";
import { PlayerProps } from "@/components/Home/type";
import { getUser } from "@/components/Home/util";
import Container from "@/components/common/Container";
import { firebaseAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { GrGoogle } from "react-icons/gr";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

export default function Login() {
    const [signInWithGoogle, user, _, error] = useSignInWithGoogle(firebaseAuth)
    const updateCurrentPlayer = useCurrentPlayer(state => state.updateCurrentPlayer)
    const route = useRouter()

    useEffect(() => {
        if (!user) return;

        const currentPlayer: PlayerProps = {
            name: user.user.displayName || "Anonymous",
            id: user.user.uid,
            isAnonymous: user.user.isAnonymous,
            imageUrl: user.user.photoURL,
            email: user.user.email || "none",
            matches: 0,
            win: 0,
            loss: 0,
            online: true
        }

        getUser(currentPlayer)
            .then(user => {
                updateCurrentPlayer(user as PlayerProps)
                route.push("/")
            })

    }, [updateCurrentPlayer, user, route])



    return (
        <div className="min-h-screen bg-gray-100 ">
            <Container className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <MdOutlineIntegrationInstructions className="h-8 w-8" />
                        <h1 className="text-2xl font-bold">Tic Tac Zone</h1>
                    </div>
                    <div className="space-y-4">
                        <button
                            className="w-full flex items-center justify-center  py-4 px-8 bg-blue-400 text-white rounded-full transition-transform hover:scale-105"
                            onClick={() => signInWithGoogle()}>
                            <GrGoogle className="mr-1.5 text-xl " />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    )
}
