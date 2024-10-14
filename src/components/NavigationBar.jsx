import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Nav, Navbar, Dropdown, DropdownButton, Button } from 'react-bootstrap';

import { loginRequest } from '../authConfig';

export const NavigationBar = () => {
    const { instance } = useMsal();

    let activeAccount;

    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const handleLoginPopup = () => {
        /**
         * When using popup and silent APIs, we recommend setting the redirectUri to a blank page or a page 
         * that does not implement MSAL. Keep in mind that all redirect routes must be registered with the application
         * For more information, please follow this link: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations 
         */

        instance.loginPopup({
            ...loginRequest,
            redirectUri: '/redirect'
        }).catch((error) => console.log(error));
    };

    const handleLogoutPopup = () => {
        instance.logoutPopup({
            mainWindowRedirectUri: '/', // redirects the top level app after logout
            account: instance.getActiveAccount(),
        });
    };

    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
    return (
        <>
            <Navbar bg="primary" variant="dark" className="navbarStyle">
                <a className="navbar-brand" href="/">
                    Microsoft sharepoint solution
                </a>
                <AuthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <Button
                            onClick={handleLogoutPopup}
                            size="small"
                            sx={{
                                height:'50px',
                                width:"20%",
                                backgroundColor:"#52bfff",
                                borderRadius:"50px",
                                color: "#fff",
                                fontFamily: "Exo",
                                border: "1px solid #fff",
                                "&:hover": { color: "#2ab1ff",
                                borderColor:"#52bfff" },
                            }}
                        >
                            {activeAccount ? activeAccount.name : 'Unknown'}
                        </Button>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                    <Button
                            onClick={handleLogoutPopup}
                            size="small"
                            sx={{
                                height:'50px',
                                width:"20%",
                                backgroundColor:"#52bfff",
                                borderRadius:"50px",
                                color: "#fff",
                                fontFamily: "Exo",
                                border: "1px solid #fff",
                                "&:hover": { color: "#2ab1ff",
                                borderColor:"#52bfff" },
                            }}
                        >
                            Sign In
                        </Button>
                    </div>
                </UnauthenticatedTemplate>
            </Navbar>
        </>
    );
};
