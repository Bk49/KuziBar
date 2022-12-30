// This will be the pop-up for user to make purchase of how many ticket pulls they want out of a single lottery listed
// Triggered by "Purchase Now!" button
import PurchaseModal from "../../../../components/lottery/modal/PurchaseModal"

import Z350 from "../../../assets/images/350Z.png";

export default {
    title: "Lottery/Modal/PurchaseModal",
    component: PurchaseModal,
};

const Template = (args) => <PurchaseModal {...args} />;

export const Base = Template.bind({});

Base.args = {
    lotteryObj: {
        name: "Cars Intellectual Property",
        image: Z350,
        price: "20"
    },
};
