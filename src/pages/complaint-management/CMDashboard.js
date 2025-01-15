import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Box, Button, Modal, Backdrop, Fade, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';  // Add axios for API calls
import './CMDashboard.css';

const CMDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);  // State to store fetched complaints
  const [openModal, setOpenModal] = useState(false);  // State to manage modal visibility
  const [selectedComplaint, setSelectedComplaint] = useState(null);  // State to store selected complaint
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Fetch complaints from the API
  useEffect(() => {
    Axios.get('http://localhost:1337/api/complaints')
      .then((response) => {
        setComplaints(response.data);  // Assuming the response data contains an array of complaints
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
      });
  }, []);

  // Open Modal to show complaint details
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setOpenModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedComplaint(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar (Top Navbar) */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Complaint Management Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={() => handleNavigation('/admin-dashboard')}
          >
            Admin Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#215074',
          },
        }}
      >
        <List>
          <ListItem button onClick={() => handleNavigation('/view-complaints')}>
            <ViewListIcon sx={{ mr: 1 }} />
            <ListItemText primary="View Complaints" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/assign-complaints')}>
            <AssignmentIcon sx={{ mr: 1 }} />
            <ListItemText primary="Assign Complaints" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/settings')}>
            <SettingsIcon sx={{ mr: 1 }} />
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/logout')}>
            <LogoutIcon sx={{ mr: 1 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Offset for AppBar height
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to the Complaint Management Dashboard
        </Typography>
        
        {/* Button to view complaints */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<ViewListIcon />}
          onClick={() => handleNavigation('/view-complaints')}
          sx={{ minWidth: '250px', padding: '12px 24px', fontSize: '16px' }}
        >
          View Complaints
        </Button>

        {/* Table to display complaints */}
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{complaint.firstName} {complaint.lastName}</TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>{complaint.subCategory}</TableCell>
                  <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal to show complaint details */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box sx={modalStyle}>
              {selectedComplaint && (
                <>
                  <Typography variant="h5" sx={{ marginBottom: '16px' }}>Complaint Details</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {selectedComplaint.firstName} {selectedComplaint.lastName}</Typography>
                  <Typography variant="body1"><strong>Category:</strong> {selectedComplaint.category}</Typography>
                  <Typography variant="body1"><strong>Subcategory:</strong> {selectedComplaint.subCategory}</Typography>
                  <Typography variant="body1"><strong>Details:</strong> {selectedComplaint.details}</Typography>
                  <Typography variant="body1"><strong>Location:</strong> {selectedComplaint.location}</Typography>
                  <Typography variant="body1"><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</Typography>
                  <Typography variant="body1"><strong>Phone:</strong> {selectedComplaint.phone}</Typography>

                  <Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => alert("Complaint Rejected")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => alert("Action Taken")}
                    >
                      Take Action
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  padding: 4,
  borderRadius: 2,
};

export default CMDashboard;
