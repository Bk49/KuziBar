// For items in "Lottery Drafts" tab
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Card, Divider } from "semantic-ui-react";
import { deleteLottery } from "../../../axios/lotteryAPI";

const LotteryDraftCard = ({ lottery }) => {
    const [tierCounts, setTierCounts] = useState([0, 0, 0, 0, 0, 0, 0]);
    const navigate = useNavigate();

    useEffect(() => {
        if (lottery.possible_drops && lottery.possible_drops.length > 0) {
            lottery.possible_drops.forEach(({ tier }) => {
                if (tier > 7) return;
                setTierCounts((prev) => {
                    let temp = prev;
                    temp[tier - 1] = prev[tier - 1] + 1;
                    return [...temp];
                });
            });
        }
    }, [lottery.possible_drops]);

    return (
        <Card>
            <Card.Content style={{ border: "0" }}>
                <Card.Header>{lottery.lottery_name}</Card.Header>
                <Card.Meta>
                    Item Count:{" "}
                    {lottery.possible_drops &&
                    lottery.possible_drops.length > 0 ? (
                        <ul>
                            {tierCounts.map((tierCount, index) =>
                                tierCount > 0 ? (
                                    <li key={index}>
                                        Tier{" "}
                                        {`${index + 1} (${tierCount} items)`}
                                    </li>
                                ) : (
                                    <div key={index}></div>
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
                <Button
                    onClick={() => {
                        deleteLottery(lottery._id)
                            .then(({ data }) => {
                                console.log(data);
                                window.location.reload(true);
                            })
                            .catch((e) => console.log(e));
                    }}
                    color="red"
                >
                    Delete
                </Button>
                <Button
                    onClick={() =>
                        navigate("/inventory/edit-lottery", {
                            state: { lottery_id: lottery._id },
                        })
                    }
                    primary
                >
                    Edit
                </Button>
            </Card.Content>
        </Card>
    );
};

export default LotteryDraftCard;
