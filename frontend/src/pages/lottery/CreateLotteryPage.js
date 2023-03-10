import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import Heading2 from "../../components/common/header/Heading2";
import ImageInput from "../../components/common/input/ImageInput";
import TextInput from "../../components/common/input/TextInput";
import { useSelector, useDispatch } from "react-redux";
import { resetLottery, setLotteryVal } from "../../redux/slice/lotterySlice";
import { Divider, Form, Grid, Header } from "semantic-ui-react";
import { useNavigate } from "react-router";
import "../../assets/css/pages/lottery/CreateLotteryPage.css";
import CreateLotteryItemCard from "../../components/lottery/card/CreateLotteryItemCard";
import TextButton from "../../components/common/button/TextButton";
import { publishLottery, saveLottery } from "../../axios/lotteryAPI";
import { useEffect } from "react";

const CreateLotteryPage = () => {
    const lotteryObj = useSelector((state) => state.lottery);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (lotteryObj.id.length > 0) dispatch(resetLottery());
    }, [dispatch, lotteryObj.id.length]);

    return (
        <>
            <NavBar />
            <div className="body">
                <div className="create-lottery-container">
                    <Heading1>Create Lottery</Heading1>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={4}>
                                <ImageInput
                                    name="Lottery Image"
                                    image={lotteryObj.image}
                                    setImage={(img) => {
                                        dispatch(
                                            setLotteryVal({
                                                key: "image",
                                                value: img,
                                            })
                                        );
                                    }}
                                />
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form>
                                    <TextInput
                                        width={5}
                                        placeholder="Toto4D"
                                        value={lotteryObj.lottery_name}
                                        onChange={(e, { value }) =>
                                            dispatch(
                                                setLotteryVal({
                                                    key: "lottery_name",
                                                    value: value,
                                                })
                                            )
                                        }
                                    >
                                        Lottery Name
                                    </TextInput>
                                    <TextInput
                                        width={5}
                                        placeholder={10.0}
                                        type="number"
                                        value={lotteryObj.price}
                                        onChange={(e, { value }) =>
                                            dispatch(
                                                setLotteryVal({
                                                    key: "price",
                                                    value: parseInt(value),
                                                })
                                            )
                                        }
                                    >
                                        Price per pull (Zil)
                                    </TextInput>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <br />
                    <br />
                    <br />
                </div>
                <div className="lottery-items-container">
                    <Heading2
                        button={{
                            color: "green",
                            text: "Add Item",
                            onClick: () => navigate("/create-lottery/add-item"),
                        }}
                    >
                        Lottery Items
                    </Heading2>
                    <Grid>
                        <Grid.Row columns={2}>
                            {lotteryObj.lottery_items.length > 0 ? (
                                lotteryObj.lottery_items.map((item, index) => (
                                    <CreateLotteryItemCard
                                        index={index}
                                        lotteryObj={lotteryObj}
                                        edit={false}
                                    />
                                ))
                            ) : (
                                <Header size="medium">No items</Header>
                            )}
                        </Grid.Row>
                    </Grid>
                    <Divider />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                        }}
                    >
                        <TextButton
                            text="Save Lottery"
                            color="#F77F00"
                            onClick={() => {
                                saveLottery(lotteryObj)
                                    .then((res) => console.log(res))
                                    .then(() => navigate("/"))
                                    .catch((e) => console.log(e));
                            }}
                        />
                        <div style={{ marginLeft: "0.6rem" }}></div>
                        <TextButton
                            text="Publish Lottery"
                            color="#FCBF49"
                            onClick={() => {
                                publishLottery(lotteryObj)
                                    .then((res) => console.log(res))
                                    .then(() => navigate("/"))
                                    .catch((e) => console.log(e));
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateLotteryPage;
