import { firestoreDB } from '@/firebase';
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useCurrentPlayer, useOnlineGameId } from '../Home/store';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

const GameChat = () => {
    const onlineGameId = useOnlineGameId(state => state.id)
    const currentPlayerId = useCurrentPlayer(state => state.id);
    const currentPlayerName = useCurrentPlayer(state => state.name);
    const messagesRef = collection(firestoreDB, 'chats', onlineGameId || "", 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const [messages, loading, error] = useCollectionData(messagesQuery);

    const [message, setMessage] = useState('');


    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async (event: FormEvent) => {
        event.preventDefault();

        // Validate the message
        if (message.trim() === '') {
            alert('Message cannot be empty');
            return;
        }

        // Add the message to Firestore
        await addDoc(messagesRef, {
            text: message,
            timestamp: serverTimestamp(),
            sender: currentPlayerId,
            name: currentPlayerName
        });

        // Clear the input field
        setMessage('');
    }


    return (
        <section className='bg-card rounded-2xl p-5'>
            <h2 className='font-semibold text-2xl text-secondary mb-10'> Chat Room </h2>
            <div className='flex flex-col w-full space-y-7 mb-10 h-[500px] overflow-y-scroll hide-scrollbar relative'>
                {loading && <h2 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Loading Messages...</h2>}
                {messages && messages.map((message, idx) =>
                    <ChatMessage
                        key={`message-${idx}`}
                        text={message.text}
                        right={message.sender === currentPlayerId}
                        avatar={{
                            name: message.name,
                            id: message.sender,
                        }}
                    />
                )}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </section >
    );
}

export default GameChat;