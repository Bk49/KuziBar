import CustomizeItemModal from "../../../../components/inventory/modal/CustomizeItemModal";
import Viper from "../../../assets/images/Viper.png";
import SX240 from "../../../assets/images/240SX.png";
import Z350 from "../../../assets/images/350Z.png";

export default {
    title: "Inventory/Modal/CustomizeItemModal",
    component: CustomizeItemModal,
};

const Template = (args) => <CustomizeItemModal {...args} />;

export const Base = Template.bind({});

Base.args = {
    item: {
        item_name: "Car",
        image: Viper,
        date_obtained: "29 Dec 22",
        tier: "1",
        lottery_name: "IP1",
        creator_name: "Elon Musk",
        skins: [
            {
                skin_name: "Red",
                skin_image: SX240,
            },
            {
                skin_name: "Silver",
                skin_image: Z350,
            },
        ],
    },
};
