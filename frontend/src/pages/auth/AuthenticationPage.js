import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import "../../assets/css/pages/auth/AuthenticationPage.css";
import TextInput from "../../components/common/input/TextInput";
import { Button, Form } from "semantic-ui-react";
import { useState } from "react";
import  getAuth  from "../../axios/axios-auth";

const AuthenticationPage = () => {
    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    });
    const [registerFormData, setRegisterFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    return (
        <>
            <NavBar />
            <div className="body">
                <div className="login-container">
                    <Heading1>Login</Heading1>
                    <Form>
                        <Form.Group widths={4}>
                            <TextInput
                                value={loginFormData.email}
                                onChange={(e, { value }) =>
                                    setLoginFormData((prev) => ({
                                        ...prev,
                                        email: value,
                                    }))
                                }
                                placeholder="johndoe@example.com"
                            >
                                Email
                            </TextInput>
                            <TextInput
                                type="password"
                                value={loginFormData.password}
                                onChange={(e, { value }) =>
                                    setLoginFormData((prev) => ({
                                        ...prev,
                                        password: value,
                                    }))
                                }
                                placeholder="********"
                            >
                                Password
                            </TextInput>
                        </Form.Group>
                    </Form>
                    {/* Login Button here */}
                    <Button 
                        primary 
                        onClick={ getAuth(loginFormData.email, loginFormData.password) } >
                            Login
                    </Button> 
                </div>
                <div className="register-container">
                    <Heading1>Register</Heading1>
                    <Form>
                        <Form.Group widths={4}>
                            <TextInput
                                value={registerFormData.email}
                                onChange={(e, { value }) =>
                                    setRegisterFormData((prev) => ({
                                        ...prev,
                                        email: value,
                                    }))
                                }
                                placeholder="johndoe@example.com"
                            >
                                Email
                            </TextInput>
                            <TextInput
                                type="password"
                                value={registerFormData.password}
                                onChange={(e, { value }) =>
                                    setRegisterFormData((prev) => ({
                                        ...prev,
                                        password: value,
                                    }))
                                }
                                placeholder="********"
                            >
                                Password
                            </TextInput>
                            <TextInput
                                type="password"
                                value={registerFormData.confirmPassword}
                                onChange={(e, { value }) =>
                                    setRegisterFormData((prev) => ({
                                        ...prev,
                                        confirmPassword: value,
                                    }))
                                }
                                placeholder="********"
                            >
                                Confirm Password
                            </TextInput>
                        </Form.Group>
                    </Form>
                    {/* Register Button here */}
                    <Button color="teal" onClick={()=>{}}>Register and Login</Button>
                </div>
            </div>
        </>
    );
};

export default AuthenticationPage;
