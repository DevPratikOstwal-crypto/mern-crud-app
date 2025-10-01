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
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/axiosConfig";

export default function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "Male",
    status: "Active",
    location: "",
    profile: null as File | null,
  });

  const [preview, setPreview] = React.useState<string | null>(null);

  const [snackbar, setSnackbar] = React.useState<{open: boolean; message: string; severity: "success" | "error"}>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (msg: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const res = await fetch(`${API_URL}/users`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to add user");
      showSnackbar("User added successfully", "success");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      showSnackbar("Failed to add user", "error");
    }
  };

  return (
    <Paper sx={{ width: "100%", p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Add User
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* form fields same as before */}
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="First Name" name="firstName" onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Last Name" name="lastName" onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email" name="email" onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Mobile" name="mobile" onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>Gender</Typography>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange as any}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Profile
              <input type="file" hidden name="profile" accept="image/*" onChange={handleChange} />
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {preview && <Avatar src={preview} sx={{ width: 60, height: 60 }} />}
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Location" name="location" onChange={handleChange} />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/")}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
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
