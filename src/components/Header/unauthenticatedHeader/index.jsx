import "./style.css";
import logo from '../../../Images/logo.jpg'
import { useMsal } from "@azure/msal-react";
import { Button } from "react-bootstrap";

export function UnauthenticatedHeader() {
  const { instance } = useMsal();

  const handleLogout = () => {
          instance.logoutPopup({
              postLogoutRedirectUri: "/",
              mainWindowRedirectUri: "/"
          });
      } 
  return (
   <div className="header">
        <img src={logo} alt="logo" />
        <h2>Microsoft sharepoint solution</h2>
        <Button
              onClick={handleLogout}
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
              Sign Out
          </Button>
    </div>
  );
}
