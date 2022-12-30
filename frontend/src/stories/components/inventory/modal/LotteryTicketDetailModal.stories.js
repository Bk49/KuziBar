import LotteryTicketDetailModal from "../../../../components/inventory/modal/LotteryTicketDetailModal";
import Viper from "../../../assets/images/Viper.png";
import SX240 from "../../../assets/images/240SX.png";
import Z350 from "../../../assets/images/350Z.png";
import test from "../../../assets/images/storybook-test-2.png";

export default {
    title: "Inventory/Modal/LotteryTicketDetailModal",
    component: LotteryTicketDetailModal,
};

const Template = (args) => <LotteryTicketDetailModal {...args} />;

export const Type1 = Template.bind({});

Type1.args = {
    lotteryObj: {
        lottery_name: "IP1",
        creator_name: "Eric Ng",
        image: test,
        price: "20",
        ticket_quantity: "20",
        possible_drops: [
            { image: Z350, tier: "1" },
            { image: SX240, tier: "2" },
            { image: Viper, tier: "3"},
            { image: Z350, tier: "4" },
            { image: SX240, tier: "5" },
            { image: Viper, tier: "6"},
            { image: Z350, tier: "7" },
            { image: SX240, tier: "1" },
            { image: Viper, tier: "2"},
            { image: test, tier: "3" },
        ],
    },
};
