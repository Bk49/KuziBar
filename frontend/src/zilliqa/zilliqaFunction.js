import { Zilliqa } from "./config.js";

export const contractAddress = "0xfb8092fdcd362628c916b992bc9f6cf4e97b1fe5";

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
            window.zilPay.blockchain.getBalance(account.bech32).then((data) => {
                const zil =
                    (data["result"]["balance"] / 1000000000000).toString() +
                    " Zil";
                console.log(zil);
                if (localStorage.getItem("zil_wallet"))
                    localStorage.removeItem("zil_wallet");
                localStorage.setItem("zil_wallet", zil);
            });
        });
    });
};
const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");

export const ticketContractSubscriber =
    // use wss://api-ws.zilliqa.com for Mainnet
    zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
        "wss://dev-ws.zilliqa.com",
        {
            addresses: [contractAddress],
        }
    );

export { getCurrentAccount };
