export default function MyPopup({
    closePopup,
    popupstyles = {},
    translate,
    data: {
        message,
        title,
        closeLabel,
        icon = "ⓘ",
    } = {}
}) {

    const finalTitle = title ?? translate('generic.title');
    const finalMessage = message ?? translate('generic.message');
    const finalCloseLabel = closeLabel ?? translate('util.ok');

    const classes = {
        header: `${popupstyles.header} ntpopups-header`,
        icon: `${popupstyles.icon} ntpopups-icon`,
        body: `${popupstyles.body} ntpopups-body`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        closeButton: `${popupstyles.baseButton} ntpopups-basebutton`,
    };

    return (
        <>
            <header className={classes.header}>
                <div className={classes.icon}>
                    {icon}
                </div>
                {finalTitle}
            </header>

            <section className={classes.body}>
                <p>MYPOPUP {finalMessage}</p>
            </section>

            <footer className={classes.footer}>
                <button
                    autoFocus={true}
                    className={classes.closeButton}
                    onClick={() => closePopup(true)}
                >
                    {finalCloseLabel}
                </button>
            </footer>
        </>
    );
}