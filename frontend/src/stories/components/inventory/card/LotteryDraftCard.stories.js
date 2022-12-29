// For items in "Lottery Drafts" tab

import LotteryDraftCard from "../../../../components/inventory/card/LotteryDraftCard";

export default {
    title: "Inventory/Card/LotteryDraftCard",
    component: LotteryDraftCard,
};

const Template = (args) => <LotteryDraftCard {...args} />;

export const Base = Template.bind({});

Base.args = {
    lottery: {
        lottery_name: "IP1",
        items: [
            { tier: 1 },
            { tier: 2 },
            { tier: 3 },
            { tier: 4 },
            { tier: 1 },
            { tier: 2 },
            { tier: 7 },
            { tier: 6 },
        ],
        price: "100",
    },
};
