import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "../button/IconButton";
import { SelectInput } from "../select/SelectInput";
import { PaginationList } from "../pagination-list/PaginationList";
import { PaginationEllipsis } from "../pagination-list/PaginationEllipsis";
import { GridApiContext } from "./ListAdvancedComponent";

export const ListPaginationComponent = () => {
  const { gridApi } = useContext(GridApiContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const secondPaginationButtonPageNumber =
    currentPage === 0
      ? currentPage + 2
      : currentPage >= totalPages - 2
      ? totalPages - 2
      : Math.min(currentPage + 1, totalPages);

  const thirdPaginationButtonPageNumber =
    currentPage === 0
      ? currentPage + 3
      : currentPage >= totalPages - 2
      ? totalPages - 1
      : Math.min(currentPage + 2, totalPages);

  const threePagesMiddleButtonPageNumber =
    currentPage === 0
      ? currentPage + 2
      : currentPage >= totalPages - 2
      ? totalPages - 1
      : Math.min(currentPage + 1, totalPages);

  useEffect(() => {
    if (gridApi) {
      gridApi.addEventListener("paginationChanged", handlePaginationChanged);

      setCurrentPage(gridApi.paginationGetCurrentPage());
      setTotalPages(gridApi.paginationGetTotalPages());
    }

    return () => {
      if (gridApi) {
        gridApi.removeEventListener(
          "paginationChanged",
          handlePaginationChanged
        );
      }
    };
  }, [gridApi]);

  const handlePaginationChanged = () => {
    setCurrentPage(gridApi.paginationGetCurrentPage());
    setTotalPages(gridApi.paginationGetTotalPages());
  };

  const goToPreviousPaginationPage = () => {
    if (currentPage > 0) {
      gridApi.paginationGoToPage(currentPage - 1);
    }
  };

  const goToNextPaginationPage = () => {
    if (currentPage < totalPages) {
      gridApi.paginationGoToPage(currentPage + 1);
    }
  };

  const gotToPage = (pageNumber) => {
    gridApi.paginationGoToPage(pageNumber);
  };

  const paginationEntriesPerPage = (pageSize) => {
    gridApi.paginationSetPageSize(pageSize);
  };

  return (
    <div className="list-footer">
      <div className="list-footer__entries-per-page">
        <h4>Entries per page</h4>

        <div className="list-footer-select-button">
          <SelectInput
            options={[1, 5, 10, 20]}
            iconStyle={{ height: "32px", color: "#00A353" }}
            boxStyle={{
              height: "32px",
              borderBottomLeftRadius: "0px",
              borderTopLeftRadius: "0px",
              backgroundColor: "#F0F4F6",
              color: "#272D30",
            }}
            showDropdownUpwards
            handleClick={paginationEntriesPerPage}
          />
        </div>
      </div>

      <div className="list-footer__pagination">
        <nav className="pagination is-rounded">
          <ul className="pagination-list">
            <PaginationList
              pageNumber={1}
              onClick={() => gotToPage(0)}
              isCurrent={currentPage === 0}
            />

            {totalPages === 3 && (
              <>
                <PaginationEllipsis />

                <PaginationList
                  pageNumber={threePagesMiddleButtonPageNumber}
                  onClick={() =>
                    gotToPage(threePagesMiddleButtonPageNumber - 1)
                  }
                  isCurrent={currentPage > 0 && currentPage < totalPages - 1}
                />
              </>
            )}

            {totalPages > 3 && (
              <>
                <PaginationEllipsis />

                <PaginationList
                  pageNumber={secondPaginationButtonPageNumber}
                  onClick={() =>
                    gotToPage(secondPaginationButtonPageNumber - 1)
                  }
                  isCurrent={currentPage > 0 && currentPage < totalPages - 2}
                />

                <PaginationList
                  pageNumber={thirdPaginationButtonPageNumber}
                  onClick={() => gotToPage(thirdPaginationButtonPageNumber - 1)}
                  isCurrent={currentPage === totalPages - 1}
                />
              </>
            )}

            {totalPages >= 2 && (
              <>
                <PaginationEllipsis />

                <PaginationList
                  pageNumber={totalPages}
                  onClick={() => gotToPage(totalPages)}
                  isCurrent={currentPage + 1 === totalPages}
                />
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="list-footer__navigation">
        <IconButton
          icon={
            <i
              style={{ color: "#00A353" }}
              className={`fas fa-${"chevron-left"}`}
            ></i>
          }
          style={{ border: " 1px solid #C6C6C6" }}
          onClick={goToPreviousPaginationPage}
          disabled={currentPage === 0}
        />

        <IconButton
          icon={
            <i
              style={{ color: "#00A353" }}
              className={`fas fa-${"chevron-right"}`}
            ></i>
          }
          style={{ border: " 1px solid #C6C6C6" }}
          onClick={goToNextPaginationPage}
          disabled={currentPage === totalPages - 1}
        />
      </div>
    </div>
  );
};
