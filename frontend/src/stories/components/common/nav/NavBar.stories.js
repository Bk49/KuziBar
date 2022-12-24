// This is for the whole app (To be imported in App.js!)
import React from "react";

import NavBar from "../../../../components/common/nav/NavBar";

export default {
    title: "Common/Navigations/NavBar",
    component: NavBar,
};

const Template = (args) => <NavBar {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    currentPage: "lottery",
};
