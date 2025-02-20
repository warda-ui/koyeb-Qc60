import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Static Sidebar */}
      <Drawer
        variant="permanent"
        className="drawer"
        classes={{ paper: "drawer" }}
      >
        <List className="drawer-list">
          <ListItem button className="list-item" onClick={() => navigate("/home")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button className="list-item" onClick={() => navigate("/reports")}>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button className="list-item" onClick={() => navigate("/user-management")}>
            <PeopleIcon className="icon" />
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button className="list-item" onClick={() => navigate("/complaint-management")}>
            <ListItemText primary="Complaint Management" />
          </ListItem>
          <ListItem button className="list-item" onClick={() => navigate("/login")}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar position="sticky" className="app-bar">
          <Toolbar>
            <Typography variant="h6" className="app-title">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Dashboard Body */}
        <Box className="dashboard-container">
          <div className="button-container">
            <button onClick={() => navigate("/user-management")}>USER MANAGEMENT</button>
            <button onClick={() => navigate("/complaint-management")}>COMPLAINT MANAGEMENT</button>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
