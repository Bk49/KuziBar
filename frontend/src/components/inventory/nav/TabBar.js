// This is for inventory
import "../../../assets/css/components/inventory/nav/TabBar.css"

const tabs = [
    "Owned Items",
    "Customizable Items",
    "Lottery Tickets",
    "Lottery Drafts",
];

const TabBar = ({ current, setCurrent }) => {
    return (
        <div className="tab-bar-container">
            {tabs.map((tab, index) => (
                <div
                    key={index}
                    className={`${current === index ? "tab-item-container-current" : ""} tab-item-container`}
                    onClick={() => setCurrent(index)}
                >
                    <span
                        className={`${
                            current === index ? "tab-item-strong" : ""
                        } tab-item-text`}
                    >
                        {tab}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TabBar;
