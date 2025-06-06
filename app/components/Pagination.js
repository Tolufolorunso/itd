'use client';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination-container">
            <div className="items-per-page-selector">
                <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={70}>70</option>
                    <option value={100}>100</option>
                </select>
                <span>items per page</span>
            </div>
            <div className="page-navigator">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    &laquo; Prev
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next &raquo;
                </button>
            </div>
        </div>
    );
};

export default Pagination; 