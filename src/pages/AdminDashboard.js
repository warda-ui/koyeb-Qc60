import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css';

import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Modal,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import { useForm } from "react-hook-form";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleAddUserModalOpen = () => setAddUserModalOpen(true);
  const handleAddUserModalClose = () => setAddUserModalOpen(false);

  const onSubmit = (data) => {
    // Handle form submission, like making an API call to add the user
    console.log("User data submitted: ", data);
    // Close the modal after submission
    setAddUserModalOpen(false);
  };

  return (
    <Box>
      {/* AppBar */}
      
      <AppBar position="sticky" className="app-bar">
        
  <Toolbar>
    <IconButton 
      edge="start" 
      className="icon-btn toggle-btn" 
      onClick={toggleDrawer}
    >
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" className="app-title">
      Admin Dashboard
    </Typography>
    <Box className="action-icons">
      <IconButton 
        className="icon-btn" 
        onClick={() => navigate("/settings")}
      >
        <SettingsIcon />
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>


      {/* Drawer */}
      <Drawer
  anchor="left"
  open={drawerOpen}
  onClose={toggleDrawer}
  classes={{ paper: "drawer" }}
>
  <List className="drawer-list">
    <ListItem button className="list-item" onClick={() => navigate("/home")}>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button className="list-item" onClick={() => navigate("/reports")}>
      <ListItemText primary="Reports" />
    </ListItem>
    <ListItem button className="list-item" onClick={handleAddUserModalOpen}>
      <AddCircleIcon className="icon" />
      <ListItemText primary="Add User" />
    </ListItem>
    <ListItem
      button
      className="list-item"
      onClick={() => navigate("/user-management")}
    >
      <PeopleIcon className="icon" />
      <ListItemText primary="User Management" />
    </ListItem>
    <ListItem
      button
      className="list-item"
      onClick={() => navigate("/complaint-management")}
    >
      <ListItemText primary="Complaint Management" />
    </ListItem>
    <ListItem button className="list-item" onClick={() => navigate("/login")}>
      <ListItemText primary="Logout" />
    </ListItem>
  </List>
</Drawer>


      {/* Main Body */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Welcome to Admin Dashboard
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
          <Button
  fullWidth
  variant="contained"
  color="primary"
  sx={{ height: 120 }}
  onClick={() => navigate("/user-management")}
>
  <Typography variant="h6">User Management</Typography>
</Button>

          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ height: 120 }}
              onClick={() => navigate("/complaint-management")}
            >
              <Typography variant="h6">Complaint Management</Typography>
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ height: 120 }}
              onClick={handleAddUserModalOpen}
            >
              <Typography variant="h6">Add User</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>

     
    </Box>
  );
};

export default AdminDashboard;
