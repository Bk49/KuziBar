// For items in "Owned Items" tab

// This is for Lottery Details page showing the info of every single possible drop inside the lottery listing
import "../../../assets/css/components/inventory/card/InventoryItemCard.css";
import { Card } from "semantic-ui-react";
import handleColor from "../../../functions/handleColor";
import { useEffect, useState } from "react";

const InventoryItemCard = ({ item, ...rest }) => {
    const [color, setColor] = useState("grey");

    useEffect(() => {
        setColor(handleColor(item.tier));
    }, [item.tier]);

    return (
        <Card color={color} {...rest}>
            <img
                className="inventory-item-card-item-image"
                src={item.image}
                alt=""
            />
            <Card.Content style={{ border: "none" }}>
                <Card.Header>{item.item_name}</Card.Header>
                <Card.Meta>Date Obtained: {item.date_obtained}</Card.Meta>
                <Card.Description>Rarity: Tier {item.tier}</Card.Description>
            </Card.Content>
        </Card>
    );
};

export default InventoryItemCard;
