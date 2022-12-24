import { Header, Divider } from "semantic-ui-react";
import React from 'react'

const Heading1 = ({ children }) => {
    return (
        <>
            <Header size="huge">{children}</Header>
            <Divider />
        </>
    );
};

export default Heading1;
