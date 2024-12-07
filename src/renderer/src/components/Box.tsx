export default function Box({children, style} : {
    style: React.CSSProperties | undefined,
    children: any,
}) {
    return <div className="box" style={style}>
        {children}
    </div>
}