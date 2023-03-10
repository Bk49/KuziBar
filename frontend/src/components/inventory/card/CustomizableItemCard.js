// For items in "Customizable Items" tab
import { Card } from "semantic-ui-react";
import handleColor from "../../../functions/handleColor";
import "../../../assets/css/components/inventory/card/CustomizableItemCard.css";

const CustomizableItemCard = ({ item, ...rest }) => {
    return (
        <Card color={handleColor(item.tier)} {...rest}>
            <div className="customizable-item-card-image-section-container">
                <div className="customizable-item-card-creator-container">
                    <div className="customizable-item-card-creator-initial-container">
                        <span className="customizable-item-card-creator-initial-text">
                            {item.creator_name ? item.creator_name[0] : "No Name"}
                        </span>
                    </div>
                    <span className="customizable-item-card-creator-owner-name">
                        {item.creator_name}
                    </span>
                </div>
                <div className="customizable-item-card-image-gradient">
                    <img
                        className="customizable-item-card-image"
                        src={item.image}
                        alt=""
                    />
                </div>
            </div>
            <Card.Content>
                <Card.Header>{item.item_name}</Card.Header>
                <Card.Meta>Finalize Date: {item.date_to_finalize}</Card.Meta>
                <Card.Description>
                    No. of Skins {item.skins.length}
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

export default CustomizableItemCard;
