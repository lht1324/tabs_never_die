export default function Row({ children }) {
    return (
        <div className="row" style={{ display: 'flex', flexDirection: 'row' }}>
            {children}
        </div>
    )
}