import Header from "../Components/Header.js";
import "./HomeScreen.css";
import c2c from "../assets/c2caftermovie.mp4";
import dummyimage from "../assets/rishabh-profile.jpg";
import icons from "./socialicondata";

const IconComponent = ({ src, link, name }) => {
  return (
    <a
      className={`${name} mainIcon social-box w-inline-block`}
      href={link}
      rel="noreferrer"
      target="_blank"
    >
      <img className="z-10 fimg" src={src} alt="icon" />
    </a>
  );
};
export default function HomeScreen() {
  return (
    <div className="HomeScreen">
      <Header />
      <article className="MainSectionHome">
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
              Join the <span className="titlecardhighlight">niftysubs</span>{" "}
              community!
            </div>
            <div className="cardsubtitle">
              Discover the best live streams anywhere.
            </div>
            <div className="connectbuttoncard">Connect Wallet</div>
          </div>
        </section>
        <section className="mainsection">
          <section className="videosection">
            <div className="window__frame__image">
              <video
                className="video-border"
                controls
                autostart="true"
                autoPlay
                loop={true}
                muted
                src={c2c}
                type="video/mp4"
              />
            </div>
            <div className="videoinfo">
              <div className="videocreatorimage">
                <img
                  className="creatorimage"
                  src={dummyimage}
                  alt="creator profile"
                />
              </div>
              <div className="videodetails">
                <div className="creatorname">KasparvoChess</div>
                <div className="videotitle">
                  Grand Chess Tour 2021 - Paris Rapid Day 3 | kasparovchess.com
                </div>
                <div className="videogenre">
                  <div className="genrecategory">Chess</div>
                  <div className="genrelanguage">English</div>
                  <div className="genretype">Strategy</div>
                </div>
              </div>
              <div className="startarea">
                <div className="subscribebutton">Subscribe</div>
              </div>
            </div>
            <div className="creatordetails">
              <div>
                <img
                  className="creatorprofile"
                  src={dummyimage}
                  alt="creator profile"
                />
              </div>
              <div className="creatorprofiledesc">
                <div className="creatortitle">About KasparvoChess</div>
                <div className="creatorbio">
                  Learn. Watch. Play on https://kasparovchess.com
                </div>
              </div>
              <div className="socialiconcontainer">
                <div className="icons">
                  {icons.map((icon, key) => (
                    <IconComponent
                      key={key}
                      src={icon.src}
                      name={icon.name}
                      link={icon.link}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="chatsection"></section>
        </section>
      </article>
    </div>
  );
}
