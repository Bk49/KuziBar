import { Modal, Header, Icon } from "semantic-ui-react";

const ConfirmationModal = ({ open, icon, title, children, buttons }) => {
    return (
        <Modal basic open={open} size="small">
            <Header icon>
                <Icon name={icon ? icon : "save"} />
                {title}
            </Header>
            <Modal.Content>{children}</Modal.Content>
            <Modal.Actions>{buttons}</Modal.Actions>
        </Modal>
    );
};

export default ConfirmationModal;
