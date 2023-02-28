function Pagination({ children, shown, close }: any) {
    return shown ? (
        <div className="modal-backdrop" onClick={() => { close( localStorage.setItem("filteredLang", "")) }}>
            <div className="modal-content" onClick={(e) => { e.stopPropagation() }}>
                {children}
            </div>
        </div>
    ) : null;
}
export default Pagination;