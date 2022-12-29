// This is for Lottery Details page showing the info of every single possible drop inside the lottery listing

import React from "react";

import LotteryDropsCard from "../../../../components/lottery/card/LotteryDropsCard";
import Viper from "../../../assets/images/Viper.png";
import SX240 from "../../../assets/images/240SX.png";
import Z350 from "../../../assets/images/350Z.png";

export default {
    title: "Lottery/Card/LotteryDropsCard",
    component: LotteryDropsCard,
};

const Template = (args) => <LotteryDropsCard {...args} />;

export const Tier1 = Template.bind({});

Tier1.args = {
    item: {
        item_name: "Nissan 350Z",
        image: Z350,
        skins: [1, 2, 3, 4],
        tier: "1",
    },
};

export const Tier2 = Template.bind({});

Tier2.args = {
    item: {
        item_name: "Dodge Viper SRT",
        image: Viper,
        skins: [],
        tier: "2",
    },
};

export const Tier3 = Template.bind({});

Tier3.args = {
    item: {
        item_name: "Nissan 240SX (S13)",
        image: SX240,
        skins: [1, 2],
        tier: "3",
    },
};
