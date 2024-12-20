import { useMemo, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// react-table components
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";

// Material Dashboard 2 React example components
import DataTableHeadCell from "components/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "components/Tables/DataTable/DataTableBodyCell";
import { TableCell, Typography, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
// import { DateRangePicker } from "@mui/x-date-pickers/DateRangePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css"; // Import RSuite styles
import moment from "moment";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
  showMessage,
  date,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleDateFilter,
  loading,
  fetchError,
  errorHandling,
}) {
  const defaultValue = entriesPerPage.defaultValue
    ? entriesPerPage.defaultValue
    : 5;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value);

  // Render the paginations
  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0
      ? gotoPage(0)
      : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }) =>
    gotoPage(Number(value.value - 1));

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart =
    pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  // dateFilter
  const dateChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setStartDate(newValue[0] ? moment(newValue[0]) : null);
      setEndDate(newValue[1] ? moment(newValue[1]) : null);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {entriesPerPage || canSearch || date ? (
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDTypography variant="caption" color="secondary">
                &nbsp;&nbsp;Entries per page
              </MDTypography>
            </MDBox>
          )}
          {canSearch && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MDBox width="12rem" ml="auto">
                <MDInput
                  placeholder="Search..."
                  value={search}
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }) => {
                    setSearch(search);
                    onSearchChange(currentTarget.value);
                  }}
                  // sx={{ width: "200px", mr: 1 }} // Adjust width as needed
                />
              </MDBox>
            </LocalizationProvider>
          )}
          {date && (
            <MDBox
              width="12rem"
              ml="auto"
              display="flex"
              justifyContent="space-evenly"
              gap="2"
            >
              <DateRangePicker
                showOneCalendar
                placeholder="Select Date Range"
                value={[
                  startDate ? startDate.toDate() : null,
                  endDate ? endDate.toDate() : null,
                ]} // Convert moment to Date for the picker
                onChange={dateChange}
                // style={{ width: "fit-content" }} // Style adjustments
              />
              <Icon
                onClick={handleDateFilter}
                sx={{
                  cursor: "pointer ",
                  fontWeight: 600,
                  mt: 0.8,
                  ml: 0.5,
                }}
              >
                arrow_forward
              </Icon>
            </MDBox>
          )}
        </MDBox>
      ) : null}
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(
                    isSorted && column.getSortByToggleProps()
                  )}
                  width={column.width ? column.width : 50}
                  align={column.align ? column.align : "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        {/* Loading message */}
        {loading && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  headerGroups && headerGroups[0]
                    ? headerGroups[0].headers.length
                    : 1
                }
                align="center"
              >
                <Typography
                  component="h6"
                  sx={{
                    color: "#344767",
                    fontWeight: 600,
                    lineHeight: 1.625,
                    fontSize: "1rem",
                    m: 3,
                  }}
                >
                  Loading...
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {/* Show error message if there is a fetch error */}
        {!loading && fetchError && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  headerGroups && headerGroups[0]
                    ? headerGroups[0].headers.length
                    : 1
                }
                align="center"
              >
                <Typography
                  component="h6"
                  sx={{
                    color: "#344767",
                    fontWeight: 600,
                    lineHeight: 1.625,
                    fontSize: "1rem",
                    m: 3,
                  }}
                >
                  {errorHandling || "Unable to fetch data"}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {/* No data found */}
        {!loading && !fetchError && page.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  headerGroups && headerGroups[0]
                    ? headerGroups[0].headers.length
                    : 1
                }
                align="center"
              >
                <Typography
                  component="h6"
                  sx={{
                    color: "#344767",
                    fontWeight: 600,
                    lineHeight: 1.625,
                    fontSize: "1rem",
                    m: 3,
                  }}
                >
                  No data found
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {/* Render the table rows when data is available */}
        {!loading && !fetchError && page.length > 0 && (
          <TableBody {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
              return (
                <TableRow key={key} {...row.getRowProps()}>
                  {row.cells.map((cell, idx) => (
                    <DataTableBodyCell
                      key={idx}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {showMessage === "" && (
        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
        >
          {showTotalEntries && (
            <MDBox mb={{ xs: 3, sm: 0 }}>
              <MDTypography
                variant="button"
                color="secondary"
                fontWeight="regular"
              >
                Showing {entriesStart} to {entriesEnd} of {rows.length} entries
              </MDTypography>
            </MDBox>
          )}
          {pageOptions.length > 1 && (
            <MDPagination
              variant={pagination.variant ? pagination.variant : "gradient"}
              color={pagination.color ? pagination.color : "info"}
            >
              {canPreviousPage && (
                <MDPagination item onClick={() => previousPage()}>
                  <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                </MDPagination>
              )}
              {renderPagination.length > 6 ? (
                <MDBox width="5rem" mx={1}>
                  <MDInput
                    inputProps={{
                      type: "number",
                      min: 1,
                      max: customizedPageOptions.length,
                    }}
                    value={customizedPageOptions[pageIndex]}
                    onChange={
                      (handleInputPagination, handleInputPaginationValue)
                    }
                  />
                </MDBox>
              ) : (
                renderPagination
              )}
              {canNextPage && (
                <MDPagination item onClick={() => nextPage()}>
                  <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                </MDPagination>
              )}
            </MDPagination>
          )}
        </MDBox>
      )}
    </TableContainer>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 5, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  date: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  showMessage: "",
  loading: false, // Default value for loading
  fetchError: false, // Default value for fetchError
  errorHandling: "",
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  date: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  showMessage: PropTypes.string,
  loading: PropTypes.bool, // Prop validation for loading
  fetchError: PropTypes.bool, // Prop validation for fetchError
  errorHandling: PropTypes.string,
};

export default DataTable;
