// For items in "Lottery Tickets" tab

import LotteryTicketCard from "../../../../components/inventory/card/LotteryTicketCard";
import Viper from "../../../assets/images/Viper.png";
import SX240 from "../../../assets/images/240SX.png";
import Z350 from "../../../assets/images/350Z.png";

export default {
    title: "Inventory/Card/LotteryTicketCard",
    component: LotteryTicketCard,
};

const Template = (args) => <LotteryTicketCard {...args} />;

export const Base = Template.bind({});

Base.args = {
    lotteryObj: {
        lottery_name: "IP1",
        creator_name: "DeviousComet465",
        image: Viper,
        possible_drops: [{ image: Viper }, { image: SX240 }, { image: Z350 }],
        price: "20",
    },
};
