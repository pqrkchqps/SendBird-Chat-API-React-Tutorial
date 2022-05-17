import { useState } from 'react';

import CreateUserForm from './CreateUserForm'
import Channel from './Channel'
import MessagesList from "./MessagesList"
import MessageInput from "./MessageInput"

const channelName = "Test Channel"
const ChatRoom = () => {

    const [state, updateState] = useState({
        messages: [ {created_at: 1544421761159, user: {user_id: "id1", nickname:"joey"}, message: "Hey hey", message_id: "id1"},
                    {created_at: 1544532800000, user: {user_id: "id2", nickname:"george"}, message: "hi", message_id: "id2"},
                    {created_at: 1546421780000, user: {user_id: "id1", nickname:"joey"}, message: "Hey hey hey", message_id: "id3"}],
        messageInputValue: "",
        userNameInputValue: "",
        userIdInputValue: "",
        isSettingUpUser: true,
        isLoading: false,
        error: false
    });

    const onUserNameInputChange = (e) => {
        const userNameInputValue = e.currentTarget.value;
        updateState({ ...state, userNameInputValue });
    }

    const onUserIdInputChange = (e) => {
        const userIdInputValue = e.currentTarget.value;
        updateState({ ...state, userIdInputValue });
    }

    const onMessageInputChange = (e) => {
        const messageInputValue = e.currentTarget.value;
        updateState({ ...state, messageInputValue });
    }
    
    const setupUser = async () => {
        updateState({ ...state, isSettingUpUser: false });
    }

    const sendMessage = async () => {
        const { messages, userIdInputValue, userNameInputValue, messageInputValue } = state;

        const message = {
                        created_at: 1544421761159, 
                        user: {
                            user_id: userIdInputValue, 
                            nickname: userNameInputValue
                        },
                        message: messageInputValue, 
                        message_id: messages[messages.length-1].message_id+"!"
        }
        const updatedMessages = [...messages, message]
        updateState({ ...state, messages: updatedMessages });
    }
    

    if (state.isLoading) {
        return <div>Loading...</div>
    }

    if (state.error) {
        return <div className="error">{state.error} check console for more information.</div>
    }

    console.log('- - - - State object very useful for debugging - - - -');
    console.log(state);
    
    return (
        <>
            {state.isSettingUpUser && 
                <CreateUserForm 
                    setupUser={setupUser}
                    userNameInputValue={state.userNameInputValue}
                    userIdInputValue={state.userIdInputValue}
                    onUserIdInputChange={onUserIdInputChange}
                    onUserNameInputChange={onUserNameInputChange} />
            }
            <Channel channelName={channelName}>
                <MessagesList
                    messages={state.messages}
                    userId={state.userIdInputValue} />
                <MessageInput 
                    value={state.messageInputValue}
                    onChange={onMessageInputChange}
                    sendMessage={sendMessage}/>
            </Channel>
        </>
    );
};

export default ChatRoom;
