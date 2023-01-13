// This is for the whole app (To be imported in App.js!)
import logo from "../../../assets/images/app-logo.png";
import { ReactComponent as LotteryIcon } from "../../../assets/icons/Slot.svg";
import { ReactComponent as InventoryIcon } from "../../../assets/icons/Storage.svg";
import "../../../assets/css/components/common/nav/NavBar.css";
import { useNavigate } from "react-router-dom";
import TextButton from "../button/TextButton";
import TextIconButton from "../button/TextIconButton";
import { ReactComponent as WalletIcon } from "../../../assets/icons/Wallet Filled.svg";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const NavBar = ({ currentPage }) => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [update, setUpdate] = useState(0);
    const [zilWallet, setZilWallet] = useState("");
    const [zilUpdate, setZilUpdate] = useState(0);

    // connect to wallet
    const getCurrentAccount = () => {
        window.zilPay.wallet.connect().then((connected) => {
            console.log(connected);
            console.log(window.zilPay.wallet.net);
            console.log(window.zilPay.wallet.defaultAccount);

            // subscribe to network changes
            window.zilPay.wallet.observableNetwork().subscribe((network) => {
                console.log("Network has been changed to " + network);
            });

            // subscribe to user account changes
            window.zilPay.wallet.observableAccount().subscribe((account) => {
                console.log(
                    "Account has been changed to " +
                        account.base16 +
                        " (" +
                        account.bech32 +
                        ")"
                );
                if (localStorage.getItem("zil_address"))
                    localStorage.removeItem("zil_addrss");
                localStorage.setItem("zil_address", [
                    account.base16,
                    account.bech32,
                ]);
                window.zilPay.blockchain
                    .getBalance(account.bech32)
                    .then((data) => {
                        const zil =
                            (
                                data["result"]["balance"] / 1000000000000
                            ).toString() + " Zil";
                        console.log(zil);
                        setZilWallet(zil);
                        if (localStorage.getItem("zil_wallet"))
                            localStorage.removeItem("zil_wallet");
                        localStorage.setItem("zil_wallet", zil);
                    });
            });
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUserEmail(jwtDecode(token).sub);
        } else {
            setUserEmail("");
        }
    }, [update]);

    useEffect(() => {
        const zil = localStorage.getItem("zil_wallet");
        console.log(zil);
        if (zil) {
            setZilWallet(zil);
        } else {
            setZilWallet("");
        }
    }, setZilUpdate);

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
                    <TextIconButton
                        text={
                            zilWallet && zilWallet.length > 0
                                ? zilWallet
                                : "Connect Wallet"
                        }
                        Icon={WalletIcon}
                        onClick={() => {
                            getCurrentAccount();
                        }}
                    />
                </div>

                <div className="button-container">
                    {userEmail && userEmail.length > 0 ? (
                        <div
                            onClick={() => {
                                if (localStorage.getItem("token"))
                                    localStorage.removeItem("token");
                                if (localStorage.getItem("userId"))
                                    localStorage.removeItem("userId");
                                setUpdate((prev) => ++prev);
                            }}
                            className="user-initial-container"
                        >
                            <span className="user-initial-text">
                                {userEmail[0]}
                            </span>
                        </div>
                    ) : (
                        <TextButton
                            onClick={() => navigate("/login")}
                            text="Login"
                            color="#F77F00"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
