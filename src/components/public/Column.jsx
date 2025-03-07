export default function Column({ children }) {
    return (
        <div className="column" style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
        </div>
    )
}