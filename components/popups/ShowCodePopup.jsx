import { FaCode } from "react-icons/fa";

export default function ShowCodePopup({
    closePopup,
    popupstyles = {},
    data: {
        content,
    } = {}
}) {

    return (
        <>
            <header className={popupstyles.header}>
                <div className={popupstyles.icon}>
                    <FaCode />
                </div>
                <span>Code</span>
            </header>

            <section className={popupstyles.body} style={{
                width: "min(800px, 80vw)", minWidth: "100%",
                height: "100vh",
            }}>
                {content}
            </section>

            <footer className={popupstyles.footer}>
                <button
                    autoFocus={true}
                    className={popupstyles.baseButton}
                    base-button-no-flex="true"
                    onClick={() => {
                        closePopup(true);
                    }}
                >
                    <span>Close</span>
                </button>
            </footer>
        </>
    );
}