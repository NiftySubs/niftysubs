import "./Components.css";
import niftysubs from '../assets/niftysubs.svg'
function Header() {
  return (
    <div className="Header">
      <div className="headercomp">
        <img className="headerlogo" src={niftysubs} alt="Niftysubs Logo"></img>

        <div>Browse</div>
      </div>
      <div></div>
      <div className="headercomp">
        <div className="connectbuttoncard">Connect Wallet</div>
      </div>
    </div>
  );
}

export default Header;
