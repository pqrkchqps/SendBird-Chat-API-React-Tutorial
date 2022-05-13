import Message from "./Message";

const MessagesList = ({ messages, userId }) => {
    return messages.map(message => {
        return (
            <div key={message.message_id} className="oc-message-item">
                <Message 
                    message={message}
                    userId={userId}
                />
            </div>);
    })
}

export default MessagesList