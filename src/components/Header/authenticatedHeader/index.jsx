import "./style.css";
import logo from '../../../Images/logo.jpg'

export function AuthenticatedHeader() {
 
  return (
   <div className="header">
        <img src={logo} alt="logo" />
        <h2>Microsoft sharepoint solution</h2>
    </div>
  );
}
