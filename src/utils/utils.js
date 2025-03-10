// 차후 너무 커지면 파일 단위로 분리할 것

export function getTimeAgoText(isoString, isEnglish) {
    // 저장된 ISO 문자열을 Date 객체로 변환합니다.
    // Date 객체는 내부적으로 UTC 기준 타임스탬프를 사용합니다.
    const pastDate = new Date(isoString);
    const nowDate = new Date();

    // 초는 없애는 게 맞는데 시간, 일 단위로 커질 때 반올림 문제 발생 가능성이 있다
    // 이건 기술적인 게 아닌 기획적인 문제라 고민할 필요가 있다.
    pastDate.setSeconds(0, 0);
    nowDate.setSeconds(0, 0);

    // getTime()은 UTC 기준 밀리초 타임스탬프를 반환합니다.
    const diffMs = nowDate.getTime() - pastDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return isEnglish ? "Just now" : "방금 전";
    if (diffMinutes < 60) return isEnglish ? `${diffMinutes} minutes ago` : `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return isEnglish ? `${diffHours} hours ago` : `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    return isEnglish ? `${diffDays} days ago` : `${diffDays}일 전`;
}

export function getFormattedDateText(isoString, isEnglish) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();

    const monthText = month.toString().padStart(2, '0');
    const dayText = day.toString().padStart(2, '0');
    const hourText = (hour > 12 ? hour - 12 : hour).toString().padStart(2, "0");
    const minText = min.toString().padStart(2, "0");

    const ampmText = hour < 12
        ? isEnglish ? "AM" : "오전"
        : isEnglish ? "PM" : "오후"

    return isEnglish
        ? `${monthText}/${dayText}/${year}, ${hourText}:${minText} ${ampmText}`
        : `${year}년 ${monthText}월 ${dayText}일 ${ampmText} ${hourText}시 ${minText}분`
}

export function isJSONEmpty(jsonObject) {
    return !jsonObject || (jsonObject && Object.keys(jsonObject).length === 0 && jsonObject.constructor === Object);
}