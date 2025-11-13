import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxButtons = 5;
  let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const buttonClasses = (active = false) =>
    `px-4 py-2 rounded transition-all duration-200 font-medium shadow-sm min-w-[40px] h-10 flex items-center justify-center ${
      active
        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
        : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md'
    } border border-gray-200`;

  return (
    <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
      {/* Botón anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md min-w-[40px] h-10 flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
      </button>

      {/* Primer página y salto */}
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={buttonClasses()}>
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 text-gray-400 flex items-center">
              <FontAwesomeIcon icon={faEllipsis} />
            </span>
          )}
        </>
      )}

      {/* Botones de páginas visibles */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={buttonClasses(page === currentPage)}
        >
          {page}
        </button>
      ))}

      {/* Última página y salto */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-400 flex items-center">
              <FontAwesomeIcon icon={faEllipsis} />
            </span>
          )}
          <button onClick={() => onPageChange(totalPages)} className={buttonClasses()}>
            {totalPages}
          </button>
        </>
      )}

      {/* Botón siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md min-w-[40px] h-10 flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
