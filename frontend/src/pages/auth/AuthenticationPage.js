import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import "../../assets/css/pages/auth/AuthenticationPage.css";
import TextInput from "../../components/common/input/TextInput";
import { Button, Form } from "semantic-ui-react";
import { useState } from "react";
import instance from "../../axios/config";
import { toFormData } from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router";

const AuthenticationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    });
    const [registerFormData, setRegisterFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const getAuth = async (e) => {
        e.preventDefault();

        //declare url
        const TOKEN_URL = "/token";

        //append data to formdata, which is specified in the API
        const bodyFormData = new FormData();
        const email = loginFormData.email;
        const password = loginFormData.password;
        bodyFormData.append("username", email);
        bodyFormData.append("password", password);

        //declare header
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                accept: "application/json",
            },
        };

        try {
            const response = await instance.post(
                TOKEN_URL,
                bodyFormData,
                config
            );
            console.log(response.data);
            const accessToken = response?.data?.access_token;
            const refreshToken = response?.data?.refresh_token;

            const credentialObj = {
                email: email,
                access_token: accessToken,
                refresh_token: refreshToken,
            };
            dispatch(setCredentials(credentialObj));
            navigate("/create-lottery");
        } catch (err) {
            if (!err?.reponse) {
                console.log("No Server Response");
            } else if (err.response?.status === 400) {
                console.log("Missing username or password");
            } else if (err.response?.status === 401) {
                console.log("Unauthorized");
            } else {
                console.log("Login Failed");
            }
        }
    };

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
                    <Button primary onClick={getAuth}>
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
                    <Button color="teal" onClick={() => {}}>
                        Register and Login
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AuthenticationPage;
