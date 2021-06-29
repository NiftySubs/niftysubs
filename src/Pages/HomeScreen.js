import Header from "../Components/Header.js";
import "./HomeScreen.css";
export default function HomeScreen() {
  return (
    <div className="HomeScreen">
      <Header />
      <section classname="sidepanel">
        <div className="title">Recommended Channels</div>
        <div className="artists">
          <div classname="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category"></div>
            </div>
            <div>🔴 17.3K</div>
          </div>
          <div classname="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category"></div>
            </div>
            <div>🔴 17.3K</div>
          </div>
          <div classname="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category"></div>
            </div>
            <div>🔴 17.3K</div>
          </div>
          <div classname="artist">
            <div>
              <div className="artistname">KasparvoChess</div>
              <div className="category"></div>
            </div>
            <div>🔴 17.3K</div>
          </div>
        </div>
      </section>
      <section className="mainsection"></section>
    </div>
  );
}
