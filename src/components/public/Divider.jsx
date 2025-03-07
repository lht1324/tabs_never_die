export function Divider({
    className = "divider",
    width = "100%",
    height = "1px",
    backgroundColor = "dimgrey",
}) {
    const style = {
        width: width,
        height: height,
        background: backgroundColor,
    }

    return (
        <div className={className} style={style}/>
    )
}