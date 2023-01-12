// import {} from 'react'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Grid, Header } from "semantic-ui-react";
import { getLottery, getLotteryItems } from "../../axios/lotteryAPI";
import Heading1 from "../../components/common/header/Heading1";
import NavBar from "../../components/common/nav/NavBar";
import ItemDetailModal from "../../components/lottery/modal/ItemDetailModal";
import PurchaseModal from "../../components/lottery/modal/PurchaseModal";

const LotteryDetailPage = () => {
    const { state } = useLocation();
    const [items, setItems] = useState([]);
    const [lottery, setLottery] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        if (state.lottery_id) {
            const { lottery_id } = state;
            getLotteryItems(lottery_id)
                .then(({ data }) => {
                    setItems(data);
                })
                .catch((e) => console.log(e));
            getLottery(lottery_id)
                .then(({ data }) => {
                    setLottery({ ...data, lottery_id: state.lottery_id });
                })
                .catch((e) => console.log(e));
        }
    }, [state]);

    return (
        <>
            <NavBar />
            <div className="body">
                <Heading1>Lottery Details</Heading1>
                <Grid>
                    <Grid.Row style={{ marginBottom: "1.2rem" }} columns={5}>
                        {items && items.length > 0 ? (
                            items.map((item, index) => (
                                <Grid.Column key={index}>
                                    <ItemDetailModal item={item} />
                                </Grid.Column>
                            ))
                        ) : (
                            <Header>
                                Error retrieving items in the lottery
                            </Header>
                        )}
                    </Grid.Row>
                </Grid>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        position: "sticky",
                    }}
                >
                    <PurchaseModal navigate={navigate} lotteryObj={lottery}/>
                </div>
            </div>
        </>
    );
};

export default LotteryDetailPage;
