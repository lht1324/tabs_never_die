import "./MainPage.css"
import {useCallback, useEffect, useState} from "react";
import Spacer from "../public/Spacer";
import {sendMessage} from "/src/utils/chromeAPI.js";
import {getFormattedDateText, getTimeAgoText} from "../../utils/utils.js";
import Row from "../public/Row.jsx";
import SettingButton from "./SettingButton.jsx";
import {useNavigate} from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();
    
    const [savedTabList, setSavedTabList] = useState([]);
    const [tabCount, setTabCount] = useState(0);

    const [lastSaveDateText, setLastSaveDateText] = useState("");
    const [formattedLastSaveDateText, setFormattedLastSaveDateText] = useState("");

    const updateUserTabSaveData = useCallback(async () => {
        sendMessage(
            "getTabData",
            (tabData) => {
                const {
                    tabList,
                    lastSaveDate
                } = tabData;

                setSavedTabList(tabList);
                setLastSaveDateText(getTimeAgoText(lastSaveDate, false));
                setFormattedLastSaveDateText(getFormattedDateText(lastSaveDate, false));
            }
        )
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
        await updateUserTabSaveData();
    }, [updateUserTabSaveData]);
    
    const handleClickSetting = useCallback(() => {
        navigate("/setting")
    }, [navigate]);

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
            <Row>
                <h1 className="main_page_title">Tabs Never Die</h1>
                <Spacer height="1px"/>
                <SettingButton
                    src="./src/assets/ic_setting.svg"
                    onClick={() => { handleClickSetting(); }}
                />
            </Row>
            <Spacer height="12px"/>
            <div className="main_page_description_container">
                <p>현재 저장된 탭은 {tabCount}개입니다.</p>
                <p>마지막 저장: {lastSaveDateText} ({formattedLastSaveDateText})</p>
                <button onClick={handleSaveTabs}>Save Tabs</button>
                <button onClick={handleGetTabs}>Get Tabs</button>

            </div>
        </div>
    )
}