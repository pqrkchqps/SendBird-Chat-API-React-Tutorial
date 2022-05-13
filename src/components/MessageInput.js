const MessageInput = () => {
    return (
        <div className="message-input">
            <input placeholder="write a message" />

            <div className="message-input-buttons">
                <button className="send-message-button">Send Message</button>
            </div>

        </div>);
}

export default MessageInput