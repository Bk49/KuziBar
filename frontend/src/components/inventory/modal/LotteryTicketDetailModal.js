import { useState } from "react";
import { Modal, Grid, Header, Button, Card } from "semantic-ui-react";
import LotteryTicketCard from "../card/LotteryTicketCard";
import "../../../assets/css/components/inventory/modal/LotteryTicketDetailModal.css";
import handleColor from "../../../functions/handleColor";
import { useTicket as openTicket } from "../../../axios/ticketAPI";

const LotteryTicketDetailModal = ({ lotteryObj, setUpdate }) => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [result, setResult] = useState({});

    return (
        <>
            <Modal
                closeIcon
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                trigger={<LotteryTicketCard lotteryObj={lotteryObj} />}
            >
                <Modal.Header>{`${lotteryObj.lottery_name} (Ticket)`}</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={7}>
                                <div className="lottery-ticket-modal-image-container">
                                    <img
                                        className="lottery-ticket-modal-image"
                                        src={lotteryObj.image}
                                        alt=""
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <Modal.Description style={{ height: "100%" }}>
                                    <div className="lottery-ticket-details-description-container">
                                        <div>
                                            <Header>Top Possible Drops</Header>
                                            <Grid>
                                                <Grid.Row columns={5}>
                                                    {lotteryObj.possible_drops
                                                        .slice(0, 10)
                                                        .map(
                                                            (
                                                                { image, tier },
                                                                index
                                                            ) => (
                                                                <Grid.Column
                                                                    style={{
                                                                        marginBottom:
                                                                            index >=
                                                                            5
                                                                                ? "0"
                                                                                : "2rem",
                                                                    }}
                                                                    key={index}
                                                                >
                                                                    <Card
                                                                        color={handleColor(
                                                                            tier
                                                                        )}
                                                                    >
                                                                        <img
                                                                            className="lottery-ticket-modal-possible-drop-card-image"
                                                                            src={
                                                                                image
                                                                            }
                                                                            alt=""
                                                                        />
                                                                    </Card>
                                                                </Grid.Column>
                                                            )
                                                        )}
                                                </Grid.Row>
                                            </Grid>
                                        </div>
                                        <div>
                                            <Header>
                                                Quantity in Inventory
                                            </Header>
                                            <p>{`${lotteryObj.ticket_quantity} Tickets @ ${lotteryObj.price} Zil each`}</p>
                                        </div>
                                    </div>
                                </Modal.Description>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <Button
                        color="green"
                        onClick={() => {
                            openTicket(lotteryObj._id)
                                .then(({ data }) => {
                                    console.log(data);
                                    setResult(data);
                                })
                                .then(() => setOpen2(true))
                                .catch((e) => console.log(e));
                        }}
                    >
                        Use Ticket
                    </Button>
                </Modal.Actions>
            </Modal>
            <Modal
                closeIcon
                onOpen={() => setOpen2(true)}
                onClose={() => {
                    setUpdate((prev) => ++prev);
                    setOpen(false);
                    setOpen2(false);
                }}
                open={open2}
            >
                <Modal.Header>Congratulations! You got...</Modal.Header>

                <Modal.Content>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={7}>
                                <div className="lottery-ticket-pull-modal-image-container">
                                    <div className="lottery-ticket-pull-modal-gradient-border">
                                        <img
                                            className="lottery-ticket-pull-modal-image"
                                            src={lotteryObj.image}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <Modal.Description style={{ height: "100%" }}>
                                    {/* To be changed to the item being returned after rolling */}
                                    <Header>
                                        {result.item_name
                                            ? result.item_name
                                            : "Unknown item"}
                                    </Header>
                                    <p>
                                        Congratulations for obtaining a Tier{" "}
                                        {result.tier ? result.tier : "7"} Prize!
                                    </p>
                                    <p>
                                        You can choose your customizations for
                                        this item in your "Customizable Items"
                                        section of "Inventory" (Customizations)
                                        will also be auto-assigned if not done
                                        before{" "}
                                        {result.date_to_finalize
                                            ? result.date_to_finalize
                                            : "Unknown date"}
                                    </p>
                                </Modal.Description>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        onClick={() => {
                            setResult({});
                            setUpdate((prev) => ++prev);
                            setOpen(false);
                            setOpen2(false);
                        }}
                    >
                        Confirm
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
};

export default LotteryTicketDetailModal;
