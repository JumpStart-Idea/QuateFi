import React, { useState } from "react";
import { Box, useTheme, TextField, InputAdornment, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery, useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import FlexBetween from "components/FlexBetween";
import SearchIcon from "@mui/icons-material/Search";

const Transactions = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  // Fetch all customers to map user IDs to names
  const { data: usersData } = useGetCustomersQuery();
  
  // Create a map of user IDs to names
  const userMap = React.useMemo(() => {
    const map = {};
    if (usersData) {
      usersData.forEach(user => {
        map[user._id] = user.name;
      });
    }
    return map;
  }, [usersData]);
  
  // Add user names to transactions data
  const data = React.useMemo(() => {
    if (!transactionsData) return null;
    
    return {
      ...transactionsData,
      transactions: transactionsData.transactions.map(transaction => ({
        ...transaction,
        userName: userMap[transaction.userId] || 'Unknown User'
      }))
    };
  }, [transactionsData, userMap]);

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Convert search term to lowercase for case-insensitive search
      const searchTerm = searchInput.trim().toLowerCase();
      setSearch(searchTerm);
      setPage(0); // Reset to first page when searching
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchInput]);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userName",
      headerName: "User",
      flex: 1,
      valueGetter: (params) => params.row.userName || 'Unknown User',
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween mb={2} flexWrap="wrap" gap={2}>
        <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
        <Box display="flex" gap={2} width={isNonMobile ? 'auto' : '100%'}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by ID, user, date, products, or amount..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{
              width: isNonMobile ? '400px' : '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.alt,
                borderRadius: '9px',
              },
              '& .MuiOutlinedInput-input': {
                padding: '10px 14px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </FlexBetween>
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.default,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: () => null }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
