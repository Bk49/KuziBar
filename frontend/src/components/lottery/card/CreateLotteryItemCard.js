// This is the card being displayed after the user "Add Item" in the Create Lottery Page

import { Grid, Card, Label, Header, Icon } from "semantic-ui-react";
import { setItem } from "../../../redux/slice/itemSlice";
import { deleteLotteryItem } from "../../../redux/slice/lotterySlice";
import handleColor from "../../../functions/handleColor";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const CreateLotteryItemCard = ({ index, lotteryObj, edit }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <Grid.Column style={{ marginTop: "1rem" }}>
            <Card
                fluid
                color={handleColor(lotteryObj.lottery_items[index].tier)}
            >
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <img
                                className="create-lottery-item-image-preview"
                                src={lotteryObj.lottery_items[index].image}
                                height="100%"
                                width="100%"
                                alt=""
                            />
                            <Label
                                style={{
                                    marginRight: "1rem",
                                }}
                                color={handleColor(
                                    lotteryObj.lottery_items[index].tier
                                )}
                                attached="top right"
                            >
                                Tier
                                {lotteryObj.lottery_items[index].tier}
                            </Label>
                        </Grid.Column>
                        <Grid.Column>
                            <div className="create-lottery-item-card-content-container">
                                <Card.Content>
                                    <div className="create-lottery-item-header-container">
                                        <Header>
                                            {
                                                lotteryObj.lottery_items[index]
                                                    .item_name
                                            }
                                        </Header>
                                        <div
                                            onClick={() => {
                                                dispatch(
                                                    setItem({
                                                        ...lotteryObj
                                                            .lottery_items[
                                                            index
                                                        ],
                                                        index: index,
                                                    })
                                                );
                                                navigate(
                                                    `/${
                                                        edit
                                                            ? "inventory/edit-lottery"
                                                            : "create-lottery"
                                                    }/edit-item`,
                                                    edit
                                                        ? {
                                                              state: {
                                                                  lottery_id:
                                                                      lotteryObj.lottery_id,
                                                              },
                                                          }
                                                        : {}
                                                );
                                            }}
                                        >
                                            <Icon name="edit" />
                                        </div>
                                    </div>
                                    <br />
                                    <Card.Description>
                                        Skins:
                                        {lotteryObj.lottery_items[index]
                                            .skins &&
                                        lotteryObj.lottery_items[index].skins
                                            .length > 0 ? (
                                            <ul>
                                                {lotteryObj.lottery_items[
                                                    index
                                                ].skins.map((skin, skinI) => (
                                                    <li key={skinI}>
                                                        {
                                                            lotteryObj
                                                                .lottery_items[
                                                                index
                                                            ].skins[skinI]
                                                                .skin_name
                                                        }
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <>
                                                {" No Skins"}
                                                <br />
                                            </>
                                        )}
                                    </Card.Description>
                                </Card.Content>
                                <div className="create-lottery-item-delete-icon-container">
                                    <div
                                        onClick={() =>
                                            dispatch(deleteLotteryItem(index))
                                        }
                                    >
                                        <Icon name="trash" />
                                    </div>
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card>
        </Grid.Column>
    );
};

export default CreateLotteryItemCard;
