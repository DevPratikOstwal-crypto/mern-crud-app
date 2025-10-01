import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  Select,
  TablePagination,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import { api, API_URL, BASE_URL } from "../api/axiosConfig";

export default function UserList() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
        search,
      });
      const res = await api<{ data: any[]; total: number }>(`/users?${q.toString()}`);
      setUsers(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      showSnackbar("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, search]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      fetchUsers();
      showSnackbar("User deleted successfully", "success");
    } catch {
      setError("Failed to delete user");
      showSnackbar("Failed to delete user", "error");
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearch("")} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" component={Link} to="/add">
            + Add User
          </Button>
          <Button variant="outlined" href={`${API_URL}/users/export`} target="_blank">
            Export to CSV
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <TableRow key={user._id}>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={user.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              await api(`/users/${user._id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ...user, status: newStatus }),
                              });
                              fetchUsers();
                              showSnackbar("Status updated successfully", "success");
                            } catch {
                              setError("Failed to update status");
                              showSnackbar("Failed to update status", "error");
                            }
                          }}
                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={user.profileUrl ? `${BASE_URL}${user.profileUrl}` : undefined}
                          alt={user.firstName}
                        />                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, user._id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem component={Link} to={`/view/${selectedId}`}>View</MenuItem>
        <MenuItem component={Link} to={`/edit/${selectedId}`}>Edit</MenuItem>
        <MenuItem onClick={() => { if (selectedId) handleDelete(selectedId); handleMenuClose(); }}>Delete</MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        ContentProps={{
          sx: {
            bgcolor: snackbar.severity === "success" ? "green" : "red",
            color: "white",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
}
