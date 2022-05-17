import { useState } from 'react';

import CreateUserForm from './CreateUserForm'
import Channel from './Channel'
import MessagesList from "./MessagesList"
import MessageInput from "./MessageInput"

import axios from 'axios'

import { SENDBIRD_INFO } from '../constants/constants';

const sendBirdConfig = {
    headers: {
        'Content-Type': "application/json; charset=utf8",
        'Api-Token': SENDBIRD_INFO.masterToken
    }
}
const sendBirdURL = `https://api-${SENDBIRD_INFO.appId}.sendbird.com/v3/`

const channelName = "Test Channel"
const ChatRoom = () => {

    const [state, updateState] = useState({
        joinedChannel: null,
        messages: [ {created_at: 1544421761159, user: {user_id: "id1", nickname:"joey"}, message: "Hey hey", message_id: "id1"},
                    {created_at: 1544532800000, user: {user_id: "id2", nickname:"george"}, message: "hi", message_id: "id2"},
                    {created_at: 1546421780000, user: {user_id: "id1", nickname:"joey"}, message: "Hey hey hey", message_id: "id3"}],
        messageInputValue: "",
        userNameInputValue: "",
        userIdInputValue: "",
        messageToUpdate: null,
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
        const { userNameInputValue, userIdInputValue } = state;

        const usersResponse = await axios.get(sendBirdURL+"users", sendBirdConfig)
        const users = usersResponse.data.users;
        const usersThatMatch = users.filter(user => user.user_id === userIdInputValue)
        
        if (usersThatMatch.length === 0) {
            const userBody = {user_id: userIdInputValue, nickname: userNameInputValue, profile_url: ""}
            await axios.post(sendBirdURL+"users", userBody, sendBirdConfig)
        } else {
            const userBody = {user_id: userIdInputValue, nickname: userNameInputValue}
            await axios.put(sendBirdURL+"users/"+userIdInputValue, userBody, sendBirdConfig)
        }

        updateState({ ...state, isLoading: true });
        let [joinedChannel, messages, error] = await joinTestChannel();
        if (error) {
            return onError(error);
        }
        updateState({ ...state, joinedChannel, messages, isLoading: false, isSettingUpUser: false });
    }

    const joinTestChannel = async () => {
        try {
            const channelResponse = await axios.get(sendBirdURL+"open_channels", sendBirdConfig);
            const channels = channelResponse.data.channels;
            let testChannel = channels.find(channel => channel.name === channelName)
            if (!testChannel) {
                const [openChannel, error] = await createChannel(channelName);
                if (error){
                    return [null, null, error]
                }
                testChannel = openChannel;
            }

            const messageslUrl = sendBirdURL+"open_channels/"+testChannel.channel_url+"/messages";
            const messagesConfig = sendBirdConfig;
            messagesConfig.params = {message_ts: 0}

            const messagesResponse = await axios.get(messageslUrl, messagesConfig);
            const messages = messagesResponse.data.messages;
            return [testChannel, messages, null];
    
        } catch (error) {
            return [null, null, error];
        }
    
    }

    const createChannel = async () => {
        try {
            const createChannelUrl = sendBirdURL+"open_channels";
            const createChannelBody = {name: channelName};
            const openChannelResponse = await axios.post(createChannelUrl, createChannelBody, sendBirdConfig)
            const openChannel = openChannelResponse.data;
            return [openChannel, null];
        } catch (error) {
            return [null, error];
        }
    
    }

    const handleDeleteMessage = async (messageToDelete) => {
        const { messages } = state;
        
        const updatedMessages = messages.filter((message) => {
            return message.message_id !== messageToDelete.message_id;
        });
        updateState({ ...state, messages: updatedMessages });
    }

    const updateMessage = async (message) => {
        updateState({ ...state, messageToUpdate: message, messageInputValue: message.message });
    }

    const sendMessage = async () => {
        const { messages, userIdInputValue, userNameInputValue, messageInputValue, messageToUpdate } = state;

        if (messageToUpdate) {
            messageToUpdate.message = messageInputValue;

            const messageIndex = messages.findIndex((item => item.message_id == messageToUpdate.message_id));
            messages[messageIndex] = messageToUpdate;

            updateState({ ...state, messages, messageInputValue: "", messageToUpdate: null });
        } else {
            const message = {
                            created_at: 1544421761159, 
                            user: {
                                user_id: userIdInputValue, 
                                nickname: userNameInputValue
                            },
                            message: messageInputValue, 
                            message_id: !messages.length ? "id" : messages[messages.length-1].message_id+"!"
            }
            const updatedMessages = [...messages, message]
            updateState({ ...state, messages: updatedMessages, messageInputValue: "" });
        }
    }

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
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
                    handleDeleteMessage={handleDeleteMessage}
                    updateMessage={updateMessage}
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
