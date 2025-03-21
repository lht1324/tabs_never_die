import "./MainPage.css"
import {useCallback, useEffect, useState} from "react";
import Spacer from "../public/Spacer";
import {sendMessage, useChromeListener} from "/src/utils/chromeAPI.js";
import {getFormattedDateText, getTimeAgoText} from "../../utils/utils.js";
import Row from "../public/Row.jsx";
import SettingButton from "./SettingButton.jsx";
import {useNavigate} from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();
    
    const [savedTabDataList, setSavedTabDataList] = useState([]);
    const [tabCount, setTabCount] = useState(0);

    const [lastSaveDateText, setLastSaveDateText] = useState("");
    const [formattedLastSaveDateText, setFormattedLastSaveDateText] = useState("");

    const updateUserTabSaveData = useCallback(async () => {
        sendMessage(
            "getTabData",
            (tabData) => {
                const {
                    tabDataList,
                    lastSaveDate
                } = tabData;

                setSavedTabDataList(tabDataList);

                if (lastSaveDate) {
                    setLastSaveDateText(getTimeAgoText(lastSaveDate, false));
                    setFormattedLastSaveDateText(getFormattedDateText(lastSaveDate, false));
                }
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
    // const handleGetTabs = useCallback(async () => {
    //     await updateUserTabSaveData();
    // }, [updateUserTabSaveData]);
    const handleRestoreTabs = useCallback(() => {
        sendMessage(
            "restoreTabs",
            () => {
                console.log("restore success");
            }
        )
    }, []);
    
    const handleClickSetting = useCallback(() => {
        navigate("/setting")
    }, [navigate]);

    useEffect(() => {
        updateUserTabSaveData().then();
    }, [])
    // message 받을 때마다 업데이트 치는 방식으로 바꾸면 이걸 아래쪽 훅으로 대체 가능할 것 같다

    useEffect(() => {
        if (savedTabDataList.length > 0) {
            setTabCount(savedTabDataList.reduce((acc, windowTabList) => acc + windowTabList.length, 0));
        }
    }, [savedTabDataList])

    useChromeListener(
        "tabListUpdated",
        () => {
            updateUserTabSaveData().then();
        }
    )

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
                {/*<button onClick={handleGetTabs}>Get Tabs</button>*/}
                <button onClick={handleRestoreTabs}>Restore Tabs</button>
            </div>
        </div>
    )
}