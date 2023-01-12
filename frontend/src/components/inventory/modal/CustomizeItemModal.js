import { Modal, Grid, Header, Form, Button } from "semantic-ui-react";
import CustomizableItemCard from "../card/CustomizableItemCard";
import { useState } from "react";
import "../../../assets/css/components/inventory/modal/CustomizeItemModal.css";
import { selectSkin } from "../../../axios/inventoryAPI";

const CustomizeItemModal = ({ item, setUpdate }) => {
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
            onClose={() => {
                setOpen(false);
                setCurrentSkin({
                    skin_name: "Default",
                    skin_image: item.image,
                });
            }}
            trigger={<CustomizableItemCard item={item} />}
        >
            <Modal.Header>Choose Skin</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={7}>
                            <div className="customize-item-modal-image-container">
                                <img
                                    className="customize-item-modal-image"
                                    src={currentSkin.skin_image}
                                    alt=""
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Modal.Description>
                                <Header>{item.item_name}</Header>
                                <p>Lottery name: {item.lottery_name}</p>
                                <Header>Select Skin</Header>
                                {item.skins && item.skins.length > 0 ? (
                                    <Form>
                                        <Form.Dropdown
                                            placeholder="Choose Skin"
                                            fluid
                                            selection
                                            options={[
                                                {
                                                    text: "Default",
                                                    value: {
                                                        skin_name: "Default",
                                                        skin_image: item.image,
                                                    },
                                                },
                                                ...item.skins.map(
                                                    ({
                                                        skin_name,
                                                        skin_image,
                                                    }) => {
                                                        return {
                                                            text: skin_name,
                                                            value: {
                                                                skin_name:
                                                                    skin_name,
                                                                skin_image:
                                                                    skin_image,
                                                            },
                                                        };
                                                    }
                                                ),
                                            ]}
                                            onChange={(e, { value }) => {
                                                const {
                                                    skin_name,
                                                    skin_image,
                                                } = value;
                                                setCurrentSkin({
                                                    skin_name: skin_name,
                                                    skin_image: skin_image,
                                                });
                                            }}
                                        />
                                    </Form>
                                ) : (
                                    <></>
                                )}
                                <p>
                                    You will no longer be able to change skin
                                    once you set it. Please choose it wisely!
                                </p>
                            </Modal.Description>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    secondary
                    onClick={() => {
                        setOpen(false);
                        setCurrentSkin({
                            skin_name: "Default",
                            skin_image: item.image,
                        });
                    }}
                >
                    Close
                </Button>
                <Button
                    color="green"
                    onClick={() => {
                        selectSkin(item._id, currentSkin.skin_image)
                            .then(({ data }) => {
                                console.log(data);
                            })
                            .then(() => {
                                setOpen(false);
                                setCurrentSkin({
                                    skin_name: "Default",
                                    skin_image: item.image,
                                });
                                setUpdate((prev) => ++prev);
                            })
                            .catch((e) => console.log(e));
                    }}
                >
                    Confirm
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CustomizeItemModal;
