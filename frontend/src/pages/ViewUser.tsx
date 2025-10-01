import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { api, BASE_URL } from "../api/axiosConfig";

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api<any>(`/users/${id}`).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            src={user.profileUrl ? `${BASE_URL}${user.profileUrl}` : undefined}
            sx={{ width: 100, height: 100, bgcolor: "primary.main" }}
          >
            {user.firstName?.[0]}
          </Avatar>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
          {user.firstName} {user.lastName}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Email</Typography>
            <Typography>{user.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Mobile</Typography>
            <Typography>{user.mobile}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Gender</Typography>
            <Typography>{user.gender}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography>{user.status}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Location</Typography>
            <Typography>{user.location}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate("/")}>Back</Button>
          <Button variant="contained" onClick={() => navigate(`/edit/${user._id}`)}>Edit</Button>
        </Box>
      </Paper>
    </Box>
  );
}
