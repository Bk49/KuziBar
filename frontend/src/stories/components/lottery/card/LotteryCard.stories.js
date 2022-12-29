// The lottery card in Lottery Listing page
import LotteryCard from "../../../../components/lottery/card/LotteryCard";
import Viper from "../../../assets/images/Viper.png";
import SX240 from "../../../assets/images/240SX.png";
import Z350 from "../../../assets/images/350Z.png";

export default {
    title: "Lottery/Card/LotteryCard",
    component: LotteryCard,
};

const Template = (args) => <LotteryCard {...args} />;

export const Base = Template.bind({});

Base.args = {
    lotteryObj: {
        image: Viper,
        lottery_name: "Car lottery",
        owner_name: "DeviousComet",
        date_created: "Jan 2022",
        possible_drops: [{ image: Viper }, { image: SX240 }, { image: Z350 }],
        price: "20",
    },
};
