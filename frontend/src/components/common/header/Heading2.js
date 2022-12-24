import { Header, Divider } from "semantic-ui-react";
import React from 'react'

const Heading2 = ({ children }) => {
    return (
        <>
            <Header size="large">{children}</Header>
            <Divider />
        </>
    );
};

export default Heading2;
