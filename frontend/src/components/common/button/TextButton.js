// The button for ref will be Create New Lottery! button
import "../../../assets/css/components/common/button/TextButton.css";

const TextButton = ({ text, color, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="button"
            style={{ background: color }}
        >
            <span className="button-text">{text}</span>
        </button>
    );
};

export default TextButton;
