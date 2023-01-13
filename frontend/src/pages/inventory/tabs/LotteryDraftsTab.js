import { useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";
import { getUserInventory } from "../../../axios/inventoryAPI";
import LotteryDraftCard from "../../../components/inventory/card/LotteryDraftCard";

const LotteryDraftsTab = ({ user }) => {
    const [drafts, setDrafts] = useState([]);

    useEffect(() => {
        getUserInventory(user, 3)
            .then(({ data }) => setDrafts(data))
            .catch((e) => console.log(e));
    }, [user]);

    return (
        <Grid style={{ width: "100%", marginTop: "0" }}>
            <Grid.Row columns={4}>
                {drafts && drafts.length > 0 ? (
                    drafts.map((draft, index) => (
                        <Grid.Column
                            key={index}
                            style={{ marginBottom: "2rem" }}
                        >
                            <LotteryDraftCard lottery={draft} />
                        </Grid.Column>
                    ))
                ) : (
                    <div style={{ margin: "1rem" }}>
                        <Header>No Lottery Drafts!</Header>
                    </div>
                )}
            </Grid.Row>
        </Grid>
    );
};

export default LotteryDraftsTab;
