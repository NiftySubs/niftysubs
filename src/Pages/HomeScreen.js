import Header from "../Components/Header.js";
import "./HomeScreen.css";
export default function HomeScreen() {
  return (
    <div className="HomeScreen">
      <Header />
      <section className="sidepanel">
        <div className="sidepaneltitle">Recommended Channels</div>
        <div className="artists">
          <div className="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category">Chess</div>
            </div>
            <div className="watchcount">🔴 17.3K</div>
          </div>
          <div className="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category">Just Chatting</div>
            </div>
            <div className="watchcount">🔴 17.3K</div>
          </div>
          <div className="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category">Minecraft</div>
            </div>
            <div className="watchcount">🔴 17.3K</div>
          </div>
          <div className="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category">Fortnite</div>
            </div>
            <div className="watchcount">🔴 17.3K</div>
          </div>
        </div>
        <div className="showmore">Show More</div>
        <div className="joincard">
          <div className="cardtitle">
            Join the <span className="titlecardhighlight">niftysubs</span> community!
          </div>
          <div className="cardsubtitle">
            Discover the best live streams anywhere.
          </div>
          <div className="connectbuttoncard">Connect Wallet</div>
        </div>
      </section>
      <section className="mainsection"></section>
    </div>
  );
}
