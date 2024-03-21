export default function FlexCenterWrapper({children}) {
    return (
        <div className="d-flex vh-100 text-center justify-content-center align-items-center">
            {children}
        </div>
    )
}