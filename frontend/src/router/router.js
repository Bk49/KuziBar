import { createBrowserRouter } from "react-router-dom";
import AuthenticationPage from "../pages/auth/AuthenticationPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import AddItemPage from "../pages/lottery/item/AddItemPage";
import EditItemPage from "../pages/lottery/item/EditItemPage";
import CreateLotteryPage from "../pages/lottery/CreateLotteryPage";
import EditLotteryPage from "../pages/lottery/EditLotteryPage";
import LotteryDetailPage from "../pages/lottery/LotteryDetailPage";
import LotteryListingPage from "../pages/lottery/LotteryListingPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LotteryListingPage />,
    },
    {
        path: "login",
        element: <AuthenticationPage />,
    },
    {
        path: "inventory",
        element: <InventoryPage />,
    },
    {
        path: "inventory/edit-lottery",
        element: <EditLotteryPage />,
    },
    {
        path: "create-lottery",
        element: <CreateLotteryPage />,
    },
    {
        path: "create-lottery/add-item",
        element: <AddItemPage />,
    },
    {
        path: "create-lottery/edit-item",
        element: <EditItemPage />,
    },
    {
        path: "lottery-details", // lottery-details/:lottery_id
        element: <LotteryDetailPage />,
    },
]);

export default router;
