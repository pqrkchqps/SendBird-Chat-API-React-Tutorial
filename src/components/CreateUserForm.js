const CreateUserForm = ({setupUser}) => {
    return <div className="overlay">
        <div className="overlay-content">
            <div>User ID</div>

            <input
                className="form-input"
                type="text" />

            <div>User Nickname</div>
            <input
                className="form-input"
                type="text" />

            <div>

                <button
                    className="user-submit-button"
                    onClick={setupUser}>Connect</button>
            </div>
        </div>

    </div>
}

export default CreateUserForm