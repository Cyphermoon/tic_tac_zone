import React from 'react'
import ChatMessage from './ChatMessage'
import ChatSearch from './ChatSearch'

const GameChat = () => {
    return (
        <section className='bg-card rounded-2xl p-5'>
            <h2 className='font-semibold text-2xl text-secondary mb-10'> Chat Room </h2>
            <div className='flex flex-col w-full space-y-7 mb-10 h-[500px] overflow-y-scroll hide-scrollbar'>
                <ChatMessage
                    text='How are you doing bro'
                    right={false}
                    avatar={{
                        name: 'Cypher Moon',
                        id: 'cypher-273',
                    }} />
                <ChatMessage
                    text='How are you doing bro'
                    right={false}
                    avatar={{
                        name: 'Cypher Moon',
                        id: 'cypher-273',
                    }} />
                <ChatMessage
                    text="I'm holding up quite well"
                    right={true}
                    avatar={{
                        name: 'Jack Smith',
                        id: 'cypher-821',
                    }} />
                <ChatMessage
                    text="I'm holding up quite well"
                    right={true}
                    avatar={{
                        name: 'Jack Smith',
                        id: 'cypher-821',
                    }} />
                <ChatMessage
                    text="I'm holding up quite well"
                    right={true}
                    avatar={{
                        name: 'Jack Smith',
                        id: 'cypher-821',
                    }} />
            </div>
            <ChatSearch />
        </section>
    )
}

export default GameChat