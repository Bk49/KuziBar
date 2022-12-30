import { useState } from "react";
import { Header, Modal, Grid, Button } from "semantic-ui-react";
import "../../../assets/css/components/inventory/modal/InventoryItemModal.css";
import InventoryItemCard from "../card/InventoryItemCard";

const InventoryItemModal = ({ item }) => {
    const [open, setOpen] = useState(false);

    return (
        <Modal
            closeIcon
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            trigger={<InventoryItemCard item={item} />}
        >
            <Modal.Header>{item.item_name}</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={7}>
                            <div className="inventory-item-modal-image-container">
                                <img
                                    className="inventory-item-modal-image"
                                    src={item.image}
                                    alt=""
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Modal.Description>
                                <Header>Details</Header>
                                <p>
                                    This item is obtained from the lottery:{" "}
                                    {item.lottery_name}
                                </p>
                                <p>Rarity: Tier {item.tier}</p>
                                <p>Date Obtained: {item.date_obtained}</p>
                            </Modal.Description>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button secondary onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default InventoryItemModal;
