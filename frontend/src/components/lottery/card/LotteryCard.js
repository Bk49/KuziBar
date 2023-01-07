// The lottery card in Lottery Listing page
import { Card, Grid, Icon } from "semantic-ui-react";
import LotteryCardItemImage from "../../common/image/LotteryCardItemImage";
import "../../../assets/css/components/lottery/card/LotteryCard.css";

const LotteryCard = ({ onClick, lotteryObj }) => {
    return (
        <Card
            onClick={onClick}
            style={{ overflow: "hidden", marginBottom: "2rem" }}
        >
            <div className="lottery-card-image-section-container">
                <div className="lottery-card-creator-container">
                    <div className="lottery-card-creator-initial-container">
                        <span className="lottery-card-creator-initial-text">
                            {lotteryObj.creator_name[0]}
                        </span>
                    </div>
                    <span className="lottery-card-creator-owner-name">
                        {lotteryObj.creator_name}
                    </span>
                </div>
                <div className="lottery-card-image-gradient">
                    <img
                        className="lottery-card-image"
                        src={lotteryObj.image}
                        alt=""
                    />
                </div>
            </div>
            <Card.Content
                style={{
                    border: "none",
                    paddingTop: "0.8rem",
                    paddingBottom: "0.3rem",
                }}
            >
                <Card.Header>{lotteryObj.lottery_name}</Card.Header>
                <Card.Meta>Created in {lotteryObj.date_created}</Card.Meta>
                <Card.Description>
                    <span className="lottery-card-possible-drop-text">
                        Possible Drops
                    </span>
                    <Grid style={{ marginTop: "0.1rem" }}>
                        <Grid.Row columns={3}>
                            {lotteryObj.possible_drops
                                .slice(0, 3)
                                .map(({ image }, index) => (
                                    <Grid.Column key={index}>
                                        <LotteryCardItemImage image={image} />
                                    </Grid.Column>
                                ))}
                        </Grid.Row>
                    </Grid>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div>
                    <Icon name="dollar sign" />
                    <span>{lotteryObj.price} Zil</span>
                </div>
            </Card.Content>
        </Card>
    );
};

export default LotteryCard;
