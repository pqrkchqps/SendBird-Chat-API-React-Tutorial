
import { timestampToTime } from '../utils/messageUtils';


const Message = ({ message, userId }) => {
    const messageSentByCurrentUser = message.user.user_id === userId;
    return (
        <div className="oc-message">
            <div>{timestampToTime(message.created_at)}</div>

            <div className="oc-message-sender-name">{message.user.nickname}{':'}</div>
            <div>{message.message}</div>

            {messageSentByCurrentUser && <>
                <button className="control-button">
                    <img className="oc-message-icon" src='/icon_edit.png' />
                </button>
                <button className="control-button">
                    <img className="oc-message-icon" src='/icon_delete.png' />
                </button>
            </>}


        </div >
    );

}
export default Message