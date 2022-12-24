// For Connect Wallet button that has an icon
import "../../../assets/css/components/common/button/TextIconButton.css";

const TextIconButton = ({ text, onClick, Icon }) => {
    return (
        <button
            onClick={onClick}
            className="button2"
        >
            <span className="button2-text">{text}</span>
            <Icon className="button2-icon" />
        </button>
    );
};

export default TextIconButton;
