import { authInstance } from "./config";

const buyTicket = async (lotteryId, quantity) => {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("userId is not set in the localStorage");
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
