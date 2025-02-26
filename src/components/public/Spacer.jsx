import {memo} from "react";

function Spacer({ className = "Spacer", width = "100%", height = "100%" }) {
    const style = {
        width: width,
        height: height
    }
    return (
        <div className={className} style={style}>
        </div>
    )
}

export default memo(Spacer);