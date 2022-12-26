import { Form, Input } from "semantic-ui-react";

const TextInput = ({ children, width, placeholder, type, value, onChange, name }) => {
    return (
        <Form.Field
            width={width}
            name={name}
            type={type ? type : ""}
            control={Input}
            label={children}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default TextInput;
