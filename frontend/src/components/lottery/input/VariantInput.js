// Contains an ImageInput and TextInput
import { Header, Grid, Form, Button } from "semantic-ui-react";
import ImageInput from "../../common/input/ImageInput";
import TextInput from "../../common/input/TextInput";
import { setSkinVal, removeSkin } from "../../../redux/slice/itemSlice";

const VariantInput = ({ index, itemState, dispatch }) => {
    return (
        <div style={{ marginBottom: "50px" }}>
            <Header size="medium">Skin {index + 1}</Header>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                        <ImageInput
                            name={`Skin ${index + 1} Image`}
                            image={itemState.skins[index].skin_image}
                            setImage={(img) => {
                                dispatch(
                                    setSkinVal({
                                        key: "skin_image",
                                        value: img,
                                        index: index,
                                    })
                                );
                            }}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Form style={{ height: "100%" }}>
                            <Form.Group
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <TextInput
                                    width={9}
                                    value={itemState.skins[index].skin_name}
                                    placeholder={`4D Ticket Type ${index + 1}`}
                                    onChange={(e, { value }) => {
                                        dispatch(
                                            setSkinVal({
                                                index: index,
                                                key: "skin_name",
                                                value: value,
                                            })
                                        );
                                    }}
                                >
                                    Skin Name
                                </TextInput>
                                <br />
                                <div>
                                    <Button
                                        color="red"
                                        onClick={() =>
                                            dispatch(
                                                removeSkin({
                                                    index: index,
                                                })
                                            )
                                        }
                                    >
                                        Delete Skin
                                    </Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default VariantInput;
