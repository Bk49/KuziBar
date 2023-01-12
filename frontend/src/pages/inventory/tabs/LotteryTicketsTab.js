import { useEffect, useState } from "react";
import { Grid, Header } from "semantic-ui-react";
import { getUserInventory } from "../../../axios/inventoryAPI";
import LotteryTicketDetailModal from "../../../components/inventory/modal/LotteryTicketDetailModal";

const LotteryTicketsTab = ({ user }) => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        getUserInventory(user, 2)
            .then(({ data }) => setTickets(data))
            .catch((e) => console.log(e));
    }, [user]);

    return (
        <Grid style={{ width: "100%", marginTop: "0" }}>
            <Grid.Row columns={5}>
                {tickets && tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                        <Grid.Column
                            key={index}
                            style={{ marginBottom: "2rem" }}
                        >
                            <LotteryTicketDetailModal lotteryObj={ticket} />
                        </Grid.Column>
                    ))
                ) : (
                    <div style={{ margin: "1rem" }}>
                        <Header>No Lottery Tickets!</Header>
                    </div>
                )}
            </Grid.Row>
        </Grid>
    );
};

export default LotteryTicketsTab;
