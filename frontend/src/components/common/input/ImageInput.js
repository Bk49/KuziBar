import { Header, Segment, Icon, Button, Image } from "semantic-ui-react";
import { useRef } from "react";
import "../../../assets/css/components/common/input/ImageInput.css";

const ImageInput = ({ image, setImage, name }) => {
    const fileInputRef = useRef(null);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {image.length > 0 ? (
                <Segment>
                    <Image src={image} />
                    <div className="hover-overlay">
                        <div className="image-button-container">
                            <Button color="red" onClick={() => setImage("")}>
                                Remove Image
                            </Button>
                            <br />
                            <br />
                            <Button
                                primary
                                onClick={() => fileInputRef.current.click()}
                            >
                                Change Image
                            </Button>
                        </div>
                    </div>
                </Segment>
            ) : (
                <Segment placeholder>
                    <Header icon>
                        <Icon name="file image" />
                        Select an image here!
                    </Header>
                    <Button
                        primary
                        onClick={() => fileInputRef.current.click()}
                    >
                        Add Image
                    </Button>
                </Segment>
            )}
            <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={({ target }) => {
                    const file = target.files[0];
                    const reader = new FileReader();
                    if (file) {
                        reader.onloadend = () => setImage(reader.result);
                        reader.readAsDataURL(file);
                    }
                    fileInputRef.current.value = null;
                }}
            />
            <span style={{ textAlign: "center" }}>{name}</span>
        </div>
    );
};

export default ImageInput;
