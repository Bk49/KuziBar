// For items in "Lottery Drafts" tab
import { useEffect, useState } from "react";
import { Button, Card, Divider } from "semantic-ui-react";

const LotteryDraftCard = ({ lottery }) => {
    const [tierCounts, setTierCounts] = useState([0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        if (lottery.items && lottery.items.length > 0) {
            lottery.items.forEach(({ tier }) => {
                if (tier > 7) return;
                setTierCounts((prev) => {
                    let temp = prev;
                    temp[tier - 1] = prev[tier - 1] + 1;
                    return [...temp];
                });
            });
        }
    }, [lottery.items]);

    return (
        <Card>
            <Card.Content style={{ border: "0" }}>
                <Card.Header>{lottery.lottery_name}</Card.Header>
                <Card.Meta>
                    Item Count:{" "}
                    {lottery.items && lottery.items.length > 0 ? (
                        <ul>
                            {tierCounts.map((tierCount, index) =>
                                tierCount > 0 ? (
                                    <li key={index}>
                                        Tier{" "}
                                        {`${index + 1} (${tierCount} items)`}
                                    </li>
                                ) : (
                                    <></>
                                )
                            )}
                        </ul>
                    ) : (
                        "0"
                    )}
                </Card.Meta>
                <Card.Description>
                    Price Set: {lottery.price} Zil/ticket
                </Card.Description>
                <Divider />
                <Button color="red">Delete</Button>
                <Button primary>Edit</Button>
            </Card.Content>
        </Card>
    );
};

export default LotteryDraftCard;
