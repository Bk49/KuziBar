import NavBar from "../../components/common/nav/NavBar";
import TabBar from "../../components/inventory/nav/TabBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import OwnedItemsTab from "./tabs/OwnedItemsTab";
import CustomizableItemsTab from "./tabs/CustomizableItemsTab";
import LotteryTicketsTab from "./tabs/LotteryTicketsTab";
import LotteryDraftsTab from "./tabs/LotteryDraftsTab";
import { Header } from "semantic-ui-react";

const InventoryPage = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");
        if (!token || !id) navigate("/login");
        else setUserId(id);
    }, [navigate]);

    return (
        <>
            <NavBar currentPage="inventory" />
            <div className="body">
                <TabBar current={current} setCurrent={setCurrent} />
                {current || current === 0 ? (
                    current === 0 ? (
                        <OwnedItemsTab user={userId} />
                    ) : current === 1 ? (
                        <CustomizableItemsTab user={userId} />
                    ) : current === 2 ? (
                        <LotteryTicketsTab user={userId} />
                    ) : (
                        <LotteryDraftsTab user={userId} />
                    )
                ) : (
                    <Header>There is an error displaying this page!</Header>
                )}
            </div>
        </>
    );
};

export default InventoryPage;
