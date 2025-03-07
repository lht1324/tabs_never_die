import SettingIcon from "@/assets/ic_setting.svg"

export default function SettingButton({
    className = "setting_button",
    onClick,
    style = { width: "24px", height: "24px" },
}) {
    const finalStyle = {
        cursor: "pointer",
        ...style
    }

    return (
        <div className={className} onClick={onClick}>
            <img src={SettingIcon} alt={className} style={finalStyle} />
        </div>
    )
}