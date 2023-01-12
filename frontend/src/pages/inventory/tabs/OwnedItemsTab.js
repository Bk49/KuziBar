import { useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";
import { getUserInventory } from "../../../axios/inventoryAPI";
import InventoryItemModal from "../../../components/inventory/modal/InventoryItemModal";

const OwnedItemsTab = ({ user }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getUserInventory(user, 0)
            .then(({ data }) => setItems(data))
            .catch((e) => console.log(e));
    }, [user]);

    return (
        <Grid style={{ width: "100%", marginTop: "0" }}>
            <Grid.Row columns={5}>
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <Grid.Column
                            key={index}
                            style={{ marginBottom: "2rem" }}
                        >
                            <InventoryItemModal item={item} />
                        </Grid.Column>
                    ))
                ) : (
                    <div style={{ margin: "1rem" }}>
                        <Header>No Owned Items!</Header>
                    </div>
                )}
            </Grid.Row>
        </Grid>
    );
};

export default OwnedItemsTab;
