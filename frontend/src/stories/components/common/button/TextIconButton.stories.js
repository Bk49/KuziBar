// For Connect Wallet button that has an icon
import React from "react";
import TextIconButton from "../../../../components/common/button/TextIconButton";
import { ReactComponent as WalletIcon } from "../../../../assets/icons/Wallet Filled.svg";

export default {
    title: "Common/Button/TextIconButton",
    component: TextIconButton,
};

const Template = (args) => <TextIconButton {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    text: "Connect Wallet",
    Icon: WalletIcon,
};
