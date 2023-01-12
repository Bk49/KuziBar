import { authInstance } from "./config";

const getUserInventory = async (userId, type) => {
    try {
        let url = "";
        switch (type) {
            case 1:
                url = "customizable_items";
                break;
            case 2:
                url = "lottery_tickets";
                break;
            case 3:
                url = "lottery_drafts";
                break;
            default:
                url = "owned_items";
                break;
        }

        return await authInstance.get(
            `/users/${userId}/${url}`,
            {},
            {
                headers: {
                    accept: "application/json",
                },
            }
        );
    } catch (e) {
        throw e;
    }
};

export { getUserInventory };
