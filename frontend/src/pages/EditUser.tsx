import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { api, API_URL, BASE_URL } from "../api/axiosConfig";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "Male",
    status: "Active",
    location: "",
    profile: null,
  });

  const [preview, setPreview] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api<any>(`/users/${id}`);
        setFormData({ ...user, profile: null });
        setPreview(user.profileUrl ? `${API_URL}${user.profileUrl}` : null);
      } catch (err) {
        showSnackbar("Failed to load user", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "profile" && files) {
      setFormData({ ...formData, profile: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) fd.append(key, value as any);
    });

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error("Failed to update user");

      showSnackbar("User updated successfully", "success");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      showSnackbar("Failed to update user", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Edit User
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>Gender</Typography>
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange as any}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="outlined" component="label" fullWidth>
              Change Profile
              <input
                type="file"
                hidden
                name="profile"
                accept="image/*"
                onChange={handleChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {preview ? (
              <Avatar src={preview} sx={{ width: 60, height: 60 }} />
            ) : (
              formData.profileUrl && (
                <Avatar src={`${BASE_URL}${formData.profileUrl}`} sx={{ width: 60, height: 60 }} />
              )
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button variant="outlined" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </Box>
      </form>

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
    </Paper>
  );
}
