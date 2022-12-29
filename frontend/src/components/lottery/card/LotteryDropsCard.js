// This is for Lottery Details page showing the info of every single possible drop inside the lottery listing
import "../../../assets/css/components/lottery/card/LotteryDropsCard.css"
import { Card, Label } from "semantic-ui-react";
import handleColor from "../../../functions/handleColor";
import { useEffect, useState } from "react";

const LotteryDropsCard = ({ item }) => {
    const [color, setColor] = useState("grey");

    useEffect(() => {
        setColor(handleColor(item.tier));
    }, [item.tier]);

    return (
        <Card color={color}>
            <img className="lottery-drops-card-item-image" src={item.image} alt=""/>
            <Label attached="top right" color={color}>Tier {item.tier}</Label>
            <Card.Content style={{ border: "none" }}>
                <Card.Header>{item.item_name}</Card.Header>
                <Card.Meta>Rarity: Tier {item.tier}</Card.Meta>
                <Card.Description>
                    Skins:{" "}
                    {item.skins && item.skins.length > 0
                        ? item.skins.length
                        : "No skins"}
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

export default LotteryDropsCard;
