// This will be used to contain the lottery card item image that is inside each LotteryCard (Lottery Listing) and LotteryTicketCard (Inventory > Lottery Tickets)
import React from "react";
import testImg from "../../../assets/images/storybook-test.jpg"
import LotteryCardItemImage from "../../../../components/common/image/LotteryCardItemImage";
import testImg2 from "../../../assets/images/storybook-test-2.png"

export default {
    title: 'Common/Image/LotteryCardItemImage',
    component: LotteryCardItemImage,
}

const Template = args => <LotteryCardItemImage {...args} />

export const Base = Template.bind({})

Base.args = {
    image: testImg
}

export const Two = Template.bind({})

Two.args = {
    image: testImg2
}