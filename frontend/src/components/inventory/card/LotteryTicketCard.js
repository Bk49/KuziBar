// For items in "Lottery Tickets" tab
// The lottery card in Lottery Listing page
import { Card, Grid, Icon } from "semantic-ui-react";
import LotteryCardItemImage from "../../common/image/LotteryCardItemImage";
import "../../../assets/css/components/inventory/card/LotteryTicketCard.css";

const LotteryTicketCard = ({ lotteryObj, ...rest }) => {
    return (
        <Card {...rest} color="brown" style={{ overflow: "hidden" }}>
            <div className="lottery-ticket-card-image-section-container">
                <div className="lottery-ticket-card-creator-container">
                    <div className="lottery-ticket-card-creator-initial-container">
                        <span className="lottery-ticket-card-creator-initial-text">
                            {lotteryObj.creator_name[0]}
                        </span>
                    </div>
                    <span className="lottery-ticket-card-creator-owner-name">
                        {lotteryObj.creator_name}
                    </span>
                </div>
                <div className="lottery-ticket-card-image-gradient">
                    <img
                        className="lottery-ticket-card-image"
                        src={lotteryObj.image}
                        alt=""
                    />
                </div>
            </div>
            <Card.Content style={{ border: "none", paddingTop: "0.8rem", paddingBottom:"0.3rem" }}>
                <Card.Header>{lotteryObj.lottery_name + " (Ticket)"}</Card.Header>
                <Card.Meta>Owned Quantity: {lotteryObj.ticket_quantity}</Card.Meta>
                <Card.Description>
                    <span className="lottery-ticket-card-possible-drop-text">
                        Possible Drops
                    </span>
                    <Grid style={{ marginTop: "0.1rem" }}>
                        <Grid.Row columns={3}>
                            {lotteryObj.possible_drops
                                .slice(0, 3)
                                .map(({ image }, index) => (
                                    <Grid.Column>
                                        <LotteryCardItemImage
                                            key={index}
                                            image={image}
                                        />
                                    </Grid.Column>
                                ))}
                        </Grid.Row>
                    </Grid>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div>
                    <Icon name="dollar sign" />
                    <span>{lotteryObj.price} Zil / Ticket</span>
                </div>
            </Card.Content>
        </Card>
    );
};

export default LotteryTicketCard;
