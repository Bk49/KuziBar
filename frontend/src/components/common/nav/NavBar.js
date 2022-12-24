// This is for the whole app (To be imported in App.js!)
import logo from "../../../assets/images/app-logo.png";
import { ReactComponent as LotteryIcon } from "../../../assets/icons/Slot.svg";
import { ReactComponent as InventoryIcon } from "../../../assets/icons/Storage.svg";
import "../../../assets/css/components/common/nav/NavBar.css";
import { useNavigate } from "react-router-dom";
import TextButton from "../button/TextButton";
import TextIconButton from "../button/TextIconButton";
import { ReactComponent as WalletIcon } from "../../../assets/icons/Wallet Filled.svg";

const NavBar = ({ currentPage }) => {
    const navigate = useNavigate();

    return (
        <div className="nav-container">
            <img className="app-logo" src={logo} alt="appLogo.png" />
            <div className="nav-elements-container">
                <div
                    onClick={() => navigate("/")}
                    className={`nav-item-container ${
                        currentPage === "lottery" ? "nav-item-active" : ""
                    }`}
                >
                    <LotteryIcon
                        className={`nav-icon ${
                            currentPage === "lottery" ? "nav-icon-active" : ""
                        }`}
                    />
                    <span className="nav-text">Lotteries</span>
                </div>
                <div
                    onClick={() => navigate("/inventory")}
                    className={`nav-item-container ${
                        currentPage === "inventory" ? "nav-item-active" : ""
                    }`}
                >
                    <InventoryIcon
                        className={`nav-icon ${
                            currentPage === "inventory" ? "nav-icon-active" : ""
                        }`}
                    />
                    <span className="nav-text">Inventory</span>
                </div>
                <div className="right-container">
                    <div className="button-container">
                        <TextIconButton
                            text="Connect Wallet"
                            Icon={WalletIcon}
                        />
                    </div>
                    <div className="button-container">
                        <TextButton onClick={() => navigate("/login")} text="Login" color="#F77F00" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
