// This will be the pop-up for user to make purchase of how many ticket pulls they want out of a single lottery listed
// Triggered by "Purchase Now!" button

import { useState } from "react";
import { Grid, Modal, Header, Button, Form } from "semantic-ui-react";
import TextButton from "../../common/button/TextButton";
import TextInput from "../../common/input/TextInput";
import "../../../assets/css/components/lottery/modal/PurchaseModal.css";
import { buyTicket } from "../../../axios/ticketAPI";

const PurchaseModal = ({ navigate, lotteryObj }) => {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    return (
        <Modal
            closeIcon
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            trigger={<TextButton text="Purchase Now!" color="#FCBF49" />}
        >
            <Modal.Header>Confirm your purchase</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={7}>
                            <div className="purchase-modal-image-container">
                                <img
                                    className="purchase-modal-image"
                                    src={lotteryObj.image}
                                    alt=""
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Modal.Description style={{ height: "100%" }}>
                                <div className="purchase-modal-description-container">
                                    <div className="purchase-modal-top-section-container">
                                        <Header>{lotteryObj.name}</Header>
                                        <p>
                                            Please input the number of lottery
                                            tickets you would liked to purchase
                                            for {lotteryObj.name}
                                        </p>
                                        <Form>
                                            <TextInput
                                                width={3}
                                                placeholder={1}
                                                type="number"
                                                value={quantity}
                                                onChange={(e, { value }) =>
                                                    setQuantity(
                                                        parseInt(value) <= 0
                                                            ? "1"
                                                            : value
                                                    )
                                                }
                                            >
                                                Quantity
                                            </TextInput>
                                        </Form>
                                    </div>
                                    <div className="purchase-modal-price-section-container">
                                        <span>
                                            Total: {lotteryObj.price * quantity}{" "}
                                            Zil
                                        </span>
                                    </div>
                                </div>
                            </Modal.Description>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button secondary onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        buyTicket(lotteryObj.lottery_id, quantity)
                            .then(({ data }) => console.log(data))
                            .then(() => navigate("/"))
                            .catch((e) => console.log(e));
                    }}
                    color="green"
                >
                    Confirm Purchase
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default PurchaseModal;
