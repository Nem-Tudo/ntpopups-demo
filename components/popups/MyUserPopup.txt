import { FaUserAlt } from "react-icons/fa";

export default function MyUserPopup({
    closePopup,
    popupstyles = {},
    data: {
        userName,
        userId,
        userBio,
        onAddFriend = () => { }
    } = {}
}) {

    return (
        <>
            <header className={popupstyles.header}>
                <div className={popupstyles.icon}>
                    <FaUserAlt />
                </div>
                {userName}'s Profile
            </header>

            <section className={popupstyles.body}>
                <p><b>User:</b> {userName}</p>
                <p><b>Bio:</b> {userBio}</p>
                <p><b>Id:</b> {userId}</p>
            </section>

            <footer className={popupstyles.footer}>
                <button
                    autoFocus={true}
                    className={popupstyles.baseButton}
                    base-button-style={"3"}
                    base-button-no-flex={"true"}
                    onClick={() => {
                        onAddFriend(userId)
                        closePopup(true);
                    }}
                >
                    <span>Add Friend</span>
                </button>
            </footer>
        </>
    );
}