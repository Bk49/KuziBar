import { Header, Divider, Button } from "semantic-ui-react";
import "../../../assets/css/components/common/header/Heading2.css";
const Heading2 = ({ children, button }) => {
    return (
        <>
            <div className="header-container">
                <Header size="large">{children}</Header>
                {button ? (
                    <Button
                        onClick={button.onClick}
                        color={button.color}
                        style={{ marginLeft: "auto", marginRight: "0" }}
                    >
                        {button.text}
                    </Button>
                ) : (
                    <></>
                )}
            </div>
            <Divider />
        </>
    );
};

export default Heading2;
