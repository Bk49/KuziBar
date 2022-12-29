import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Form, Grid } from "semantic-ui-react";
import Heading1 from "../../components/common/header/Heading1";
import Heading2 from "../../components/common/header/Heading2";
import ImageInput from "../../components/common/input/ImageInput";
import TextInput from "../../components/common/input/TextInput";
import NavBar from "../../components/common/nav/NavBar";
import VariantInput from "../../components/lottery/input/VariantInput";
import { addSkin, reset, setItemVal } from "../../redux/slice/itemSlice";
import { Header } from "semantic-ui-react";
import TextButton from "../../components/common/button/TextButton";
import { useState } from "react";
import ConfirmationModal from "../../components/common/modal/ConfirmationModal";
import { useNavigate } from "react-router";
import {
    addLotteryItem,
    editLotteryItem,
} from "../../redux/slice/lotterySlice";

const EditAddItemPage = ({ edit }) => {
    const itemState = useSelector((state) => state.item);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <>
            <NavBar />
            <div className="body">
                <div className="add-item-container">
                    <Heading1>{edit ? "Edit Item" : "Add Item"}</Heading1>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={4}>
                                <ImageInput
                                    name="Base Item Image"
                                    image={itemState.image}
                                    setImage={(img) => {
                                        dispatch(
                                            setItemVal({
                                                key: "image",
                                                value: img,
                                            })
                                        );
                                    }}
                                />
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form>
                                    <Form.Group>
                                        <TextInput
                                            width={9}
                                            placeholder="4D Ticket"
                                            value={itemState.item_name}
                                            onChange={(e, { value }) =>
                                                dispatch(
                                                    setItemVal({
                                                        key: "item_name",
                                                        value: value,
                                                    })
                                                )
                                            }
                                        >
                                            Item Name
                                        </TextInput>
                                        <TextInput
                                            width={3}
                                            placeholder={2}
                                            type="number"
                                            value={itemState.tier}
                                            onChange={(e, { value }) =>
                                                dispatch(
                                                    setItemVal({
                                                        key: "tier",
                                                        value: value,
                                                    })
                                                )
                                            }
                                        >
                                            Tier
                                        </TextInput>
                                    </Form.Group>
                                </Form>
                                <span>Tier Drop Rates:</span>
                                <ul>
                                    <li>Tier 1 (Red): 5%</li>
                                    <li> Tier 2 (Orange): 8%</li>
                                    <li>Tier 3 (Yellow): 12%</li>
                                    <li>Tier 4 (Purple): 15%</li>
                                    <li>Tier 5 (Blue): 18%</li>
                                    <li> Tier 6 (Green): 20%</li>
                                    <li> Tier 7(Grey): 22%</li>
                                </ul>
                                <p>
                                    If there are multiple items in the same
                                    tier, the drop rates will be evenly spread
                                    among the items
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <br />
                    <br />
                    <br />
                </div>
                <div className="add-skins-container">
                    <Heading2
                        button={{
                            text: "Add New Skin",
                            color: "blue",
                            onClick: () => {
                                dispatch(addSkin());
                            },
                        }}
                    >
                        Skins
                    </Heading2>
                    {itemState.skins.length > 0 ? (
                        itemState.skins.map((skin, index) => (
                            <VariantInput
                                key={index}
                                index={index}
                                itemState={itemState}
                                dispatch={dispatch}
                            />
                        ))
                    ) : (
                        <>
                            <Header size="medium">
                                There are no skins for this item
                            </Header>
                            <br />
                        </>
                    )}
                </div>
                <Divider />
                <br />
                <br />
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <TextButton
                        color="#F77F00"
                        text={`Save ${edit ? "Changes" : "Item"}`}
                        onClick={() => {
                            if (edit) dispatch(editLotteryItem(itemState));
                            else dispatch(addLotteryItem(itemState));
                            dispatch(reset());
                            navigate("/create-lottery");
                        }}
                    />
                    <div style={{ marginRight: "15px" }}></div>
                    <TextButton
                        color="#D62828"
                        text="Cancel"
                        onClick={() => setOpen(true)}
                    />
                </div>
            </div>
            <ConfirmationModal
                open={open}
                icon="delete"
                title="Discard Changes"
                buttons={[
                    <Button
                        key={0}
                        basic
                        color="red"
                        inverted
                        onClick={() => {
                            setOpen(false);
                            dispatch(reset());
                            navigate("/create-lottery");
                        }}
                    >
                        Discard Changes
                    </Button>,
                    <Button
                        key={1}
                        basic
                        color="green"
                        inverted
                        onClick={() => setOpen(false)}
                    >
                        Continue Edit
                    </Button>,
                ]}
            >
                Are you sure your would like to discard all changes?
            </ConfirmationModal>
        </>
    );
};

export default EditAddItemPage;
