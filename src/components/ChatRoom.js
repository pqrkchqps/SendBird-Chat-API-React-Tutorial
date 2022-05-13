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
        isSettingUpUser: true,
        isLoading: false,
        error: false
    });

    
    const setupUser = async () => {
        updateState({ ...state, isSettingUpUser: false });
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
            {state.isSettingUpUser && <CreateUserForm setupUser={setupUser} />}
            <Channel channelName={channelName}>
                <MessagesList
                    messages={state.messages}
                    userId={"id1"} />
                <MessageInput />
            </Channel>
        </>
    );
};

export default ChatRoom;
