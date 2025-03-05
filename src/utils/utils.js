// 차후 너무 커지면 파일 단위로 분리할 것

export function getTimeAgoText(isoString) {
    // 저장된 ISO 문자열을 Date 객체로 변환합니다.
    // Date 객체는 내부적으로 UTC 기준 타임스탬프를 사용합니다.
    const pastDate = new Date(isoString);
    const nowDate = new Date();

    // getTime()은 UTC 기준 밀리초 타임스탬프를 반환합니다.
    const diffMs = nowDate.getTime() - pastDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    console.log(`oldDate = ${JSON.stringify(pastDate)}`)
    console.log(`newDate = ${JSON.stringify(nowDate)}`)

    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
}