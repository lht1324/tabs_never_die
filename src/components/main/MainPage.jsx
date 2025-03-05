/*global chrome*/

import "./MainPage.css"
import {useCallback, useEffect, useState} from "react";
import Spacer from "../public/Spacer";
import UserStorageManager from "@/services/storage/UserStorageManager.js"
import {sendMessage} from "/src/utils/chromeAPI.js";
import {getTimeAgoText} from "../../utils/utils.js";

const userStorageManager = new UserStorageManager(true);

function MainPage() {
    const [savedTabList, setSavedTabList] = useState([]);
    const [tabCount, setTabCount] = useState(0);

    const [lastSaveDateText, setLastSaveDateText] = useState("");

    const updateUserTabSaveData = useCallback(async () => {
        const {
            tabList,
            lastSaveDate
        } = await userStorageManager.getUserTabData();

        setSavedTabList(tabList);
        setLastSaveDateText(getTimeAgoText(lastSaveDate));
    }, []);

    const handleSaveTabs = useCallback(async () => {
        sendMessage(
            "putTabData",
            () => {
                updateUserTabSaveData();
            }
        );
    }, [])
    const handleGetTabs = useCallback(async () => {
        console.log("useCallback getTabs")
        
        await updateUserTabSaveData();
    }, [updateUserTabSaveData]);

    useEffect(() => {
        updateUserTabSaveData().then();
    }, [])

    useEffect(() => {
        if (savedTabList.length > 0) {
            setTabCount(savedTabList.reduce((acc, windowTabList) => acc + windowTabList.length, 0));
        }
    }, [savedTabList])

    return (
        <div className="main_page_wrapper">
            <h2 className="main_page_title">Tabs Never Die</h2>
            <Spacer height="12px" />
            <div className="main_page_description_container">
                <p>현재 저장된 탭은 {tabCount}개입니다.</p>
                <p>마지막 저장: {lastSaveDateText}</p>
                <button onClick={handleSaveTabs}>Save Tabs</button>
                <button onClick={handleGetTabs}>Get Tabs</button>

            </div>
        </div>
    )
}

export default MainPage;