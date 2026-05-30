import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Pagination Component
 * Handles page navigation for task lists
 * Shows page numbers and total count
 */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total } = pagination;

  if (pages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (page >= pages - 2) {
        for (let i = pages - 4; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing page {page} of {pages} ({total} total tasks)
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="page-btn"
          title="Previous page"
        >
          <FiChevronLeft />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`page-btn ${num === page ? "active" : ""}`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="page-btn"
          title="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
