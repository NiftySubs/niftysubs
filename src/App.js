import './App.css';
import HomeScreen from './Pages/HomeScreen';
import Header from "./Components/Header";
import { useState } from "react";

function App() {

  const [currentAccount, setCurrentAccount] = useState(undefined);

  return (
    <div className="App">
        <Header currentAccountSetter={setCurrentAccount} currentAccount={currentAccount} />
        <HomeScreen currentAccount={currentAccount}/>
    </div>
  );
}

export default App;
