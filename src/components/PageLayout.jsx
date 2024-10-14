import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { AuthenticatedHeader } from "./Header/authenticatedHeader";
import { loginRequest } from '../authConfig';
import { Button } from 'react-bootstrap';
import background from "../Images/backgroundImage.jpg";
import { UnauthenticatedHeader } from "./Header/unauthenticatedHeader";

export const PageLayout = (props) => {
    const { instance } = useMsal();

    const handleLoginPopup = () => {
        instance.loginPopup({
            ...loginRequest,
            redirectUri: '/redirect'
        }).catch((error) => console.log(error));
    };

    return (
        <>
            <AuthenticatedTemplate>
                <UnauthenticatedHeader />
                <div className="home" style={{ backgroundImage: `url(${background})` }}>
                    <div className="homeContain">
                        <div className="home1" />
                        <div className="home2Container" id="home2Container" style={{ width: "80%", marginLeft: "10%", height: "50vh", backgroundColor: "white", borderRadius: "30px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", overflow: "auto" }}>
                            <div className="home2">
                                <h2>The easy way to effective deployment</h2>
                                <hr />
                                <div id="ListComponent" style={{ width: "100%" }}>
                                    {props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <AuthenticatedHeader />
                <div className="home" style={{ backgroundImage: `url(${background})` }}>
                    <div className="homeContain">
                        <div className="home1" />
                        <div className="home2Container" id="home2Container" style={{ width: "80%", marginLeft: "10%", height: "50vh", backgroundColor: "white", borderRadius: "30px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                            <div className="home2">
                                <h2>The easy way to effective deployment</h2>
                                <hr />
                                <div id="ListComponent" style={{ width: "100%" }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "7%" }}>
                                        <h3>Connect with Microsoft</h3>
                                    </div>
                                </div>
                                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                    <Button
                                        onClick={handleLoginPopup}
                                        size="small"
                                        style={{
                                            height: '50px',
                                            width: "20%",
                                            backgroundColor: "#52bfff",
                                            borderRadius: "50px",
                                            color: "#fff",
                                            fontFamily: "Exo",
                                            border: "1px solid #fff",
                                            "&:hover": { color: "#2ab1ff", borderColor: "#52bfff" },
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </UnauthenticatedTemplate>
        </>
    );
};
