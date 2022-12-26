import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import Heading2 from "../../components/common/header/Heading2";
import ImageInput from "../../components/common/input/ImageInput";
import TextInput from "../../components/common/input/TextInput";
import { useSelector, useDispatch } from "react-redux";
import { setLotteryVal } from "../../redux/slice/lotterySlice";
import { Form, Grid } from "semantic-ui-react";
import { useNavigate } from "react-router";

const CreateLotteryPage = () => {
    const lotteryObj = useSelector((state) => state.lottery);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                                                    value: value,
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
                </div>
            </div>
        </>
    );
};

export default CreateLotteryPage;
