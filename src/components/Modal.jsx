import YouTubePlayer from "./YoutubePlayer";

const Modal = ({ videoKey, closeModal }) => {
    return (
        <div className="modal-wrapper">
            {videoKey ? (
                <>
                    <span className="close_icon" onClick={closeModal}>
                         X
                    </span>
                    <YouTubePlayer videoKey={videoKey} />
                </>
            ) : (
                <div style={{ padding: "30px" }}>
                    <h6>no trailer available. Try another movie</h6>
                </div>
            )}
        </div>
    );
};

export default Modal;