import { units } from "@zilliqa-js/zilliqa";
import { BN, Long, Units } from "../zilliqa/config";
import { authInstance } from "./config";
import { Zilliqa } from "../zilliqa/config";
//purchase ticket contract
const contractAddress = "0xfb8092fdcd362628c916b992bc9f6cf4e97b1fe5";
const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");
const ownerAddress = "0x595e6B41b6ee727E48BF3A25e4C42323E26DBCF6";

const buyTicket = async (lotteryId, lotteryPrice, quantity) => {
    const isConnect = await window.zilPay.wallet.connect();
    if (isConnect) {
        const deployedContract = window.zilPay.contracts.at(contractAddress);
        const totalZil = lotteryPrice * quantity;
        const callTx = await deployedContract
            .call(
                "PurchaseTicket",
                [
                    {
                        vname: "receiver",
                        type: "ByStr20",
                        value: ownerAddress,
                    },
                ],
                {
                    version: 21823489,
                    amount: new BN(units.toQa(totalZil, units.Units.Zil)),
                    gasPrice: units.toQa("2000", units.Units.Li),
                    gasLimit: Long.fromNumber(8000),
                }
            )
            .then((receipt) => {
                console.log(receipt);
            });
    }
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw "userId is not set in the localStorage";

        return await authInstance.post(
            `/ticket`,
            {
                lottery_id: lotteryId,
                user_id: userId,
                entry_quantity: quantity,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    } catch (e) {
        throw e;
    }
};

export { buyTicket };
