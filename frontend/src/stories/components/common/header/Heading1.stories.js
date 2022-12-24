import React from "react";
import 'semantic-ui-css/semantic.min.css';

import Heading1 from "../../../../components/common/header/Heading1";

export default {
    title: "Common/Header/Heading1",
    component: Heading1,
};

const Template = (args) => <Heading1 {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    children: "Login",
};
