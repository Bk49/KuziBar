import InventoryItemModal from "../../../../components/inventory/modal/InventoryItemModal";
import Viper from "../../../assets/images/Viper.png";
import SX240 from "../../../assets/images/240SX.png";
import Z350 from "../../../assets/images/350Z.png";

export default {
    title: "Inventory/Modal/InventoryItemModal",
    component: InventoryItemModal,
};

const Template = (args) => <InventoryItemModal {...args} />;

export const Type1 = Template.bind({});

Type1.args = {
    item: {
        item_name: "Nissan 240SX (S13)",
        image: SX240,
        date_obtained: "29 Dec 22",
        tier: "1",
        lottery_name: "IP1",
    },
};

export const Type2 = Template.bind({});

Type2.args = {
    item: {
        item_name: "Dodge Viper SRT",
        image: Viper,
        date_obtained: "28 Dec 22",
        tier: "2",
        lottery_name: "IP2",
    },
};

export const Type3 = Template.bind({});

Type3.args = {
    item: {
        item_name: "Nissan 350Z",
        image: Z350,
        date_obtained: "27 Dec 22",
        tier: "3",
        lottery_name: "IP3",
    },
};
