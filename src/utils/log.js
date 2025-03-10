export function println(message) {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const hourText = hour.toString().padStart(2, "0");
    const minuteText = minute.toString().padStart(2, "0");
    const secondText = second.toString().padStart(2, "0");

    console.log(`${hourText}:${minuteText}:${secondText} - ${message}`);
}