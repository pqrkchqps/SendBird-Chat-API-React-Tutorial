const CreateUserForm = ({
    setupUser,
    userNameInputValue,
    userIdInputValue,
    onUserNameInputChange,
    onUserIdInputChange
}) => {
    return <div className="overlay">
        <div className="overlay-content">
            <div>User ID</div>

            <input
                onChange={onUserIdInputChange}
                className="form-input"
                type="text" value={userIdInputValue} />

            <div>User Nickname</div>
            <input
                onChange={onUserNameInputChange}
                className="form-input"
                type="text" value={userNameInputValue} />

            <div>
                <button
                    className="user-submit-button"
                    onClick={setupUser}>Connect</button>
            </div>
        </div>

    </div>
}

export default CreateUserForm