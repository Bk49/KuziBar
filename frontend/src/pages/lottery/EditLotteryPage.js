// import {} from 'react'
import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import Heading2 from "../../components/common/header/Heading2";
import ImageInput from "../../components/common/input/ImageInput";
import TextInput from "../../components/common/input/TextInput";
import {
    resetLotteryItems,
    setLotteryVal,
} from "../../redux/slice/lotterySlice";
import { Divider, Form, Grid, Header } from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import "../../assets/css/pages/lottery/CreateLotteryPage.css";
import CreateLotteryItemCard from "../../components/lottery/card/CreateLotteryItemCard";
import TextButton from "../../components/common/button/TextButton";
import {
    getLottery,
    getLotteryItems,
    publishLottery,
    saveLottery,
} from "../../axios/lotteryAPI";
import { useEffect } from "react";
import { resetLottery } from "../../redux/slice/lotterySlice";

const EditLotteryPage = () => {
    const { state } = useLocation();
    const lotteryObj = useSelector((state) => state.lottery);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state.r) {
            if (!state || !state.lottery_id) {
                alert("No lottery id found for edit");
                return navigate("/inventory");
            }

            if (lotteryObj.id.length === 0) dispatch(resetLottery());

            getLottery(state.lottery_id)
                .then(({ data }) => data)
                .then(({ _id, lottery_name, image, price }) => {
                    dispatch(setLotteryVal({ key: "id", value: _id }));
                    dispatch(
                        setLotteryVal({
                            key: "lottery_name",
                            value: lottery_name,
                        })
                    );
                    dispatch(setLotteryVal({ key: "image", value: image }));
                    dispatch(setLotteryVal({ key: "price", value: price }));
                })
                .then(() => {
                    dispatch(resetLotteryItems());
                    getLotteryItems(state.lottery_id)
                        .then(({ data }) => {
                            dispatch(
                                setLotteryVal({
                                    key: "lottery_items",
                                    value: data,
                                })
                            );
                        })
                        .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
        }
    }, [state, navigate, dispatch, lotteryObj.id.length]);

    return (
        <>
            <NavBar />
            <div className="body">
                <div className="create-lottery-container">
                    <Heading1>Edit Lottery</Heading1>
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
                            onClick: () =>
                                navigate("/inventory/edit-lottery/add-item", {
                                    state: { lottery_id: state.lottery_id },
                                }),
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
                                        lotteryObj={{
                                            ...lotteryObj,
                                            lottery_id: state.lottery_id,
                                        }}
                                        edit={true}
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
                                saveLottery(lotteryObj, state.lottery_id)
                                    .then(({ data }) => console.log(data))
                                    .then(() => navigate("/"))
                                    .catch((e) => console.log(e));
                            }}
                        />
                        <div style={{ marginLeft: "0.6rem" }}></div>
                        <TextButton
                            text="Publish Lottery"
                            color="#FCBF49"
                            onClick={() => {
                                publishLottery(lotteryObj, state.lottery_id)
                                    .then(({ data }) => console.log(data))
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

export default EditLotteryPage;
