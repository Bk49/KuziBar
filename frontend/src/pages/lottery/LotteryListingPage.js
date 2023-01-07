import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Grid, Header } from "semantic-ui-react";
import { getLotteries } from "../../axios/lotteryAPI";
import TextButton from "../../components/common/button/TextButton";
import NavBar from "../../components/common/nav/NavBar";
import LotteryCard from "../../components/lottery/card/LotteryCard";

const LotteryListingPage = () => {
    const [lotteries, setLotteries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getLotteries()
            .then(({ data }) => {
                console.log(data);
                setLotteries(data);
            })
            .catch((e) => console.log(e));
    }, []);

    return (
        <>
            <NavBar currentPage="lottery" />
            <div className="body">
                <Grid>
                    <Grid.Row style={{ marginBottom: "1.2rem" }} columns={5}>
                        {lotteries && lotteries.length > 0 ? (
                            lotteries.map((lottery, index) => (
                                <Grid.Column key={index}>
                                    <LotteryCard
                                        onClick={() => {
                                            if (lottery._id) {
                                                navigate("/lottery-details", {
                                                    state: {
                                                        lottery_id:
                                                            lottery._id,
                                                    },
                                                });
                                            }
                                        }}
                                        lotteryObj={lottery}
                                    />
                                </Grid.Column>
                            ))
                        ) : (
                            <Header>No lotteries~</Header>
                        )}
                    </Grid.Row>
                </Grid>
                <div
                    style={{
                        width: "100%",
                        display:"flex",
                        flexDirection:"row-reverse",
                        position: "sticky",
                    }}
                >
                    <TextButton
                        onClick={() => navigate("/create-lottery")}
                        text="Create New Lottery!"
                        color="#FCBF49"
                    />
                </div>
            </div>
        </>
    );
};

export default LotteryListingPage;
