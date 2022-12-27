import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import Heading2 from "../../components/common/header/Heading2";
import ImageInput from "../../components/common/input/ImageInput";
import TextInput from "../../components/common/input/TextInput";
import { useSelector, useDispatch } from "react-redux";
import { setLotteryVal } from "../../redux/slice/lotterySlice";
import { Card, Form, Grid, Header, Icon, Label } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../../assets/css/pages/lottery/CreateLotteryPage.css";

const handleColor = (tier) => {
    switch (tier) {
        case "1":
            return "red";
        case "2":
            return "orange";
        case "3":
            return "yellow";
        case "4":
            return "purple";
        case "5":
            return "blue";
        case "6":
            return "green";
        default:
            return "grey";
    }
};

const CreateLotteryPage = () => {
    const lotteryObj = useSelector((state) => state.lottery);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropRate, setDropRate] = useState([
        5.0, 8.0, 12.0, 15.0, 18.0, 20.0, 22.0,
    ]);

    useEffect(() => {
        console.log(lotteryObj);
        if (lotteryObj.lottery_items[0] && lotteryObj.lottery_items[0].image)
            console.log(lotteryObj.lottery_items[0].image);
    }, [lotteryObj]);

    useEffect(() => {
        let tierCount = [0, 0, 0, 0, 0, 0, 0];
        for (let { tier } of lotteryObj.lottery_items) {
            tierCount[tier - 1] = tierCount[tier - 1] + 1;
        }
        setDropRate([
            5.0 / tierCount[0],
            8.0 / tierCount[1],
            12.0 / tierCount[2],
            15.0 / tierCount[3],
            18.0 / tierCount[4],
            20.0 / tierCount[5],
            22.0 / tierCount[6],
        ]);
    }, [lotteryObj.lottery_items]);

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
                    <Grid>
                        <Grid.Row columns={2}>
                            {lotteryObj.lottery_items.length > 0 ? (
                                lotteryObj.lottery_items.map((item, index) => (
                                    <Grid.Column>
                                        <Card
                                            fluid
                                            color={handleColor(
                                                lotteryObj.lottery_items[index]
                                                    .tier
                                            )}
                                        >
                                            <Grid>
                                                <Grid.Row columns={2}>
                                                    <Grid.Column>
                                                        <img
                                                            className="create-lottery-item-image-preview"
                                                            src={
                                                                lotteryObj
                                                                    .lottery_items[
                                                                    index
                                                                ].image
                                                            }
                                                            height="100%"
                                                            width="100%"
                                                            alt=""
                                                        />
                                                        <Label
                                                            style={{
                                                                marginRight:
                                                                    "1rem",
                                                            }}
                                                            color={handleColor(
                                                                lotteryObj
                                                                    .lottery_items[
                                                                    index
                                                                ].tier
                                                            )}
                                                            attached="top right"
                                                        >
                                                            Tier
                                                            {
                                                                lotteryObj
                                                                    .lottery_items[
                                                                    index
                                                                ].tier
                                                            }
                                                        </Label>
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <div className="create-lottery-item-card-content-container">
                                                            <Card.Content>
                                                                <div className="create-lottery-item-header-container">
                                                                    <Header>
                                                                        {
                                                                            lotteryObj
                                                                                .lottery_items[
                                                                                index
                                                                            ]
                                                                                .item_name
                                                                        }
                                                                    </Header>
                                                                    <Icon name="edit" />
                                                                </div>
                                                                <br />
                                                                <Card.Description>
                                                                    Skins:
                                                                    {lotteryObj
                                                                        .lottery_items[
                                                                        index
                                                                    ].skins &&
                                                                    lotteryObj
                                                                        .lottery_items[
                                                                        index
                                                                    ].skins
                                                                        .length >
                                                                        0 ? (
                                                                        <ul>
                                                                            {lotteryObj.lottery_items[
                                                                                index
                                                                            ].skins.map(
                                                                                (
                                                                                    skin,
                                                                                    skinI
                                                                                ) => (
                                                                                    <li>
                                                                                        {
                                                                                            lotteryObj
                                                                                                .lottery_items[
                                                                                                index
                                                                                            ]
                                                                                                .skins[
                                                                                                skinI
                                                                                            ]
                                                                                                .skin_name
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    ) : (
                                                                        <span>
                                                                            No
                                                                            Skins
                                                                        </span>
                                                                    )}
                                                                    {`Drop Rate: ${
                                                                        dropRate[
                                                                            lotteryObj
                                                                                .lottery_items[
                                                                                index
                                                                            ]
                                                                                .tier -
                                                                                1
                                                                        ]
                                                                    }%`}
                                                                </Card.Description>
                                                            </Card.Content>
                                                            <div className="create-lottery-item-delete-icon-container">
                                                                <Icon name="trash" />
                                                            </div>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card>
                                    </Grid.Column>
                                ))
                            ) : (
                                <Header size="medium">No items</Header>
                            )}
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        </>
    );
};

export default CreateLotteryPage;
