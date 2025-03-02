/*global chrome*/

import "./MainPage.css"
import {useCallback, useEffect, useState} from "react";
import Spacer from "../public/Spacer";
// import { sendMessage } from "../../../public/utils/chromeAPI.js";
import userStorageManager from "@/services/storage/UserStorageManager.js"
import {sendMessage } from "/src/utils/chromeAPI.js";
// import GoogleTitle from "../public/GoogleTitle";
// import BeEvilText from "../public/BeEvilText";

function MainPage() {
    /**
     * last save date
     * currenet tab count
     * 
     */
    const [savedTabList, setSavedTabList] = useState([]);

    const handleSaveTabs = useCallback(() => {
        sendMessage("saveTabs");
    }, [])
    const handleGetTabs = useCallback(() => {
        console.log("useCallback getTabs")
        sendMessage("getTabs");
    }, [])

    useEffect(() => {
        const getTabList = async () => {
            await userStorageManager.getUserTabList();
        }

        const refreshTabList = async () => {
            const tabList = await getTabList();

            setSavedTabList(tabList);
        }

        refreshTabList();
    }, [])

    return (
        <div className="main_page_wrapper">
            <h2 className="main_page_title">Tabs Never Die</h2>
            <Spacer height="12px" />
            <div className="main_page_description_container">
                <p>현재 저장된 탭은 {savedTabList.length}개입니다.</p>
                <button onClick={handleSaveTabs}>Save Tabs</button>
                <button onClick={handleGetTabs}>Get Tabs</button>
                {/* <p>I lost over 200 tabs by this damn button.</p>
                <p>Honestly, if <GoogleTitle /> put Enable option, I don&#39;t have to make this.</p>
                <p>Nice work, <GoogleTitle />.</p>
                <p>You make one of the laziest guy in the world to start making this.</p>
                <p>I&#39;m gladly gonna <BeEvilText />.</p> */}

            </div>
        </div>
    )
}

export default MainPage;