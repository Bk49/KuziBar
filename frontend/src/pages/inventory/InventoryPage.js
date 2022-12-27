// import {} from 'react'
import NavBar from "../../components/common/nav/NavBar";
import TabBar from "../../components/inventory/nav/TabBar";
import { useState } from "react";

const InventoryPage = () => {
    const [current, setCurrent] = useState(0)

    return (
        <>
            <NavBar currentPage="inventory" />
            <div className="body">
                <TabBar current={current} setCurrent={setCurrent} />
            </div>
        </>
    );
};

export default InventoryPage;
