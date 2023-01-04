// Shows the detail of the item being selected in lottery detail together with their possible customizations
// Triggered by LotteryDropsCard

import { useState } from "react";
import { Modal, Grid, Header, Form, Button } from "semantic-ui-react";
import LotteryDropsCard from "../card/LotteryDropsCard";
import "../../../assets/css/components/lottery/modal/ItemDetailModal.css";

const ItemDetailModal = ({ item }) => {
    const [open, setOpen] = useState(false);
    const [currentSkin, setCurrentSkin] = useState({
        skin_name: "Default",
        skin_image: item.image,
    });

    return (
        <Modal
            closeIcon
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            trigger={<LotteryDropsCard item={item} />}
        >
            <Modal.Header>
                {`${item.lottery_name}'s Tier ${item.tier} Prize`}
            </Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={7}>
                            <div className="item-detail-modal-image-container">
                                <img
                                    className="item-detail-modal-image"
                                    src={currentSkin.skin_image}
                                    alt=""
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Modal.Description>
                                <Header>{item.item_name}</Header>
                                <p>
                                    Skins available:{" "}
                                    {item.skins && item.skins.length > 0
                                        ? item.skins.length
                                        : "No Skins"}
                                </p>
                                <Header>Skin Options</Header>
                                {item.skins && item.skins.length > 0 ? (
                                    <Form>
                                        <Form.Dropdown
                                            placeholder="Choose Skin"
                                            fluid
                                            selection
                                            options={[
                                                {
                                                    text: "Default",
                                                    value: item.image,
                                                },
                                                ...item.skins.map(
                                                    ({
                                                        skin_name,
                                                        skin_image,
                                                    }) => ({
                                                        text: skin_name,
                                                        value: skin_image,
                                                    })
                                                ),
                                            ]}
                                            onChange={(e, { text, value }) =>
                                                setCurrentSkin({
                                                    skin_name: text,
                                                    skin_image: value,
                                                })
                                            }
                                        />
                                    </Form>
                                ) : (
                                    <></>
                                )}
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

export default ItemDetailModal;
