import "./MainPage.css"
import Spacer from "../public/Spacer";
import GoogleTitle from "../public/GoogleTitle";
import BeEvilText from "../public/BeEvilText";

function MainPage() {
    return (
        <div className="main_page_wrapper">
            <h1 className="main_page_title">Disable Close Other Tabs</h1>
            <Spacer height="12px" />
            <div className="main_page_description_container">
                <p>I lost over 200 tabs by this damn button.</p>
                <p>Honestly, if <GoogleTitle /> put Enable option, I don&#39;t have to make this.</p>
                <p>Nice work, <GoogleTitle />.</p>
                <p>You make one of the laziest guy in the world to start making this.</p>
                <p>I&#39;m gladly gonna <BeEvilText />.</p>
            </div>
        </div>
    )
}

export default MainPage;