import {useCallback, useState} from "react";
import {Divider} from "../public/Divider.jsx";
import Spacer from "../public/Spacer.jsx";

export default function SettingPage() {
    const [isDarkMode, setDarkMode] = useState(false);
    const [autoSaveIntervalMinutes, setAutoSaveIntervalMinutes] = useState("30");

    const onChangeAutoSaveIntervalMinutes = useCallback((e) => {
        setAutoSaveIntervalMinutes(e.target.value);
    }, [])

    return (
        <div>
            <h2>자동 저장 주기</h2>
            <select onChange={onChangeAutoSaveIntervalMinutes} value={autoSaveIntervalMinutes}>
                <option value="1">1분</option>
                <option value="5">5분</option>
                <option value="10">10분</option>
                <option value="15">15분</option>
                <option value="30">30분</option>
                <option value="60">1시간</option>
                <option value="120">2시간</option>
                <option value="360">6시간</option>
                <option value="720">12시간</option>
                <option value="1440">24시간</option>
            </select>
            <Spacer height="2px"/>
            <Divider/>
            <Spacer height="2px"/>
            <h2>다크 모드</h2>
            <input type="checkbox" checked={isDarkMode} onChange={() => setDarkMode(!isDarkMode)}/>
        </div>
    )
}