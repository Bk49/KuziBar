import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";

// import { useEffect, useState } from "react";

const App = () => {
    localStorage.removeItem("zil_address");
    localStorage.removeItem("zil_wallet");
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
