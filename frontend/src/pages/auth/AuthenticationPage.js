import NavBar from "../../components/common/nav/NavBar";
import Heading1 from "../../components/common/header/Heading1";
import "../../assets/css/pages/auth/AuthenticationPage.css";
import TextInput from "../../components/common/input/TextInput";
import { Button, Form } from "semantic-ui-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getUserId, login, register } from "../../axios/authAPI";

const AuthenticationPage = () => {
    const navigate = useNavigate();

    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    });
    const [registerFormData, setRegisterFormData] = useState({
        user_name: "",
        user_email: "",
        user_password: "",
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
                        onClick={(e) => {
                            e.preventDefault();
                            login(loginFormData)
                                .then(({ data }) => {
                                    const { access_token } = data;
                                    if (localStorage.getItem("token"))
                                        localStorage.removeItem("token");
                                    localStorage.setItem("token", access_token);
                                })
                                .then(() => {
                                    getUserId()
                                        .then(({ data }) => {
                                            localStorage.setItem(
                                                "userId",
                                                data._id
                                            );
                                        })
                                        .catch((e) => console.log(e));
                                })
                                .then(() => navigate("/"))
                                .catch((e) => console.log(e));
                        }}
                    >
                        Login
                    </Button>
                </div>
                <div className="register-container">
                    <Heading1>Register</Heading1>
                    <Form>
                        <Form.Group widths={4}>
                            <TextInput
                                value={registerFormData.user_email}
                                onChange={(e, { value }) =>
                                    setRegisterFormData((prev) => ({
                                        ...prev,
                                        user_email: value,
                                    }))
                                }
                                placeholder="johndoe@example.com"
                            >
                                Email
                            </TextInput>
                            <TextInput
                                value={registerFormData.user_name}
                                onChange={(e, { value }) =>
                                    setRegisterFormData((prev) => ({
                                        ...prev,
                                        user_name: value,
                                    }))
                                }
                                placeholder="John doe"
                            >
                                Username
                            </TextInput>
                            <TextInput
                                type="password"
                                value={registerFormData.user_password}
                                onChange={(e, { value }) =>
                                    setRegisterFormData((prev) => ({
                                        ...prev,
                                        user_password: value,
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
                    <Button
                        color="teal"
                        onClick={(e) => {
                            e.preventDefault();
                            register(registerFormData)
                                .then(({ data }) => {
                                    if (localStorage.getItem("userId"))
                                        localStorage.removeItem("userId");
                                    localStorage.setItem("userId", data._id);
                                    const { user_email, user_password } =
                                        registerFormData;
                                    login({
                                        email: user_email,
                                        password: user_password,
                                    })
                                        .then(({ data }) => {
                                            console.log("Data", data)
                                            if (localStorage.getItem("token"))
                                                localStorage.removeItem(
                                                    "token"
                                                );
                                            localStorage.setItem(
                                                "token",
                                                data.access_token
                                            );
                                        })
                                        .catch((e) => {
                                            throw e;
                                        });
                                })
                                .then(() => navigate("/"))
                                .catch((e) => console.log(e));
                        }}
                    >
                        Register and Login
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AuthenticationPage;
