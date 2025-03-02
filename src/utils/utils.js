// 차후 너무 커지면 파일 단위로 분리할 것

export function getFormattedDateWithUTC() {
    const now = new Date();

    // ISO 형식의 기본 UTC 시간
    const isoString = now.toISOString().replace("Z", ""); // 기본 Z(UTC) 제거

    // 사용자의 UTC 오프셋을 분 단위로 가져옴
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;

    // 오프셋을 ±HH:MM 형식으로 변환
    const sign = offsetMinutes > 0 ? "-" : "+";
    const formattedOffset = `${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`;

    return `${isoString}${formattedOffset}`;
}