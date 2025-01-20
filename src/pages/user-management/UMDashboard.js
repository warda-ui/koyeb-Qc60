import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './UMDashboard.css';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';


const handleLogout = () => {
  // Your logout logic here (e.g., clear local storage, redirect) 
};

const UMDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showPendingPopup, setShowPendingPopup] = useState(false);
  const [selectedPendingUser, setSelectedPendingUser] = useState(null);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
const [newUser, setNewUser] = useState({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'user', // Default role
});
const handleRedirect = () => {
  navigate('/admin-dashboard'); // Redirect to Admin Dashboard
};


const handleAddUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  
  // Fetch users and admins
  useEffect(() => {
    const fetchUsersAndAdmins = async () => {
      try {
        const userResponse = await axios.get('/api/admin/approved-users');
        const adminResponse = await axios.get('/api/admin/admins');
        const pendingUserResponse = await axios.get('/api/admin/pending-users'); // Fetch pending users
  
        setUsers(userResponse.data.users.filter((user) => user.role === 'user')); // Only regular users
        setAdmins(adminResponse.data.admins);
        setPendingUsers(pendingUserResponse.data.users); // Set pending users
      } catch (error) {
        console.error('Error fetching users and admins:', error);
      }
    };
    fetchUsersAndAdmins();
  }, []);

  const handleAddUserSubmit = async () => {
    try {
        const hashedPassword = await bcrypt.hash(newUser.password, 10);    
      const userToAdd = { ...newUser, password: hashedPassword  }; // Do not manually set status here
      await axios.post('/api/admin/add-users', userToAdd); // Send request to backend
      setUsers((prevUsers) => [...prevUsers, userToAdd]); // Update UI with new user
      setShowAddUserPopup(false); // Close popup after adding user
      setNewUser({ name: '', username: '', email: '', password: '', role: 'user', status: 'approved' }); // Reset form
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  
  // Handle delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  // Handle show edit popup
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditPopup(true);
  };
  // Handle edit form submission
  const handleEditSubmit = async () => {
    try {
      const updatedUser = {
        ...selectedUser,
        name: selectedUser.name,
        email: selectedUser.email,
      };
      await axios.put(`/api/admin/users/${selectedUser._id}`, updatedUser); // Update user in the database
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? updatedUser : user
        )
      );
      setShowEditPopup(false); // Close popup after update
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleApprove = async (userId) => {
    try {
      await axios.put(`/api/admin/approve-user/${userId}`);  // Approve the user
      setPendingUsers((prevPending) => prevPending.filter((user) => user._id !== userId));  // Remove from pending list
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };
  
  const handleReject = async (userId) => {
    try {
      await axios.delete(`/api/admin/reject-user/${userId}`);  // Reject the user
      setPendingUsers((prevPending) => prevPending.filter((user) => user._id !== userId));  // Remove from pending list
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };
  

  return (

    
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
  <Typography variant="h6" className="sidebar-header">
    Admin Panel
  </Typography>
  <Button
    startIcon={<GroupAddIcon />}
    fullWidth
    className="sidebar-link"
  >
    Manage Users
  </Button>
  <Button
    startIcon={<PendingActionsIcon />}
    fullWidth
    className="sidebar-link"
    onClick={() => setShowPendingPopup(true)}
  >
    Pending Approvals
  </Button>
  <Button
    startIcon={<PersonSearchIcon />}
    fullWidth
    className="sidebar-link"
  >
    View Users
  </Button>
  <Button
    startIcon={<CategoryIcon />}
    fullWidth
    className="sidebar-link"
  >
    Manage Categories
  </Button>
  <Button
    startIcon={<LogoutIcon />}
    fullWidth
    className="sidebar-link logout-button"
    onClick={handleLogout}
  >
    Logout
  </Button>
</Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 4, marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
        {/* Navbar */}
        <Box className="navbar">
  <IconButton onClick={toggleSidebar} className="icon-button">
    <MenuIcon />
  </IconButton>
  <Typography variant="h5" className="title">
    Welcome to User Management
  </Typography>
</Box>


      {/* Buttons */}
<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 4 }}>
<Button
      variant="contained"
      color="primary"
      startIcon={<AdminPanelSettingsIcon />}
      fullWidth
      sx={{ minWidth: '200px' }}
      onClick={handleRedirect} // Call handleRedirect on click
    >
      Admin Dashboard
    </Button>

  <Button
    variant="contained"
    color="secondary"
    startIcon={<PersonAddIcon />}
    fullWidth
    sx={{ minWidth: '200px' }}
    onClick={() => setShowAddUserPopup(true)}
  >
Add User  </Button>

  <Button
    variant="contained"
    color="default"
    startIcon={<PersonAddIcon />}
    fullWidth
    sx={{ minWidth: '200px' }}
    onClick={() => setShowPendingPopup(true)}  // Trigger the popup
  >
View Pending Requests  </Button>
</Box>

        <Dialog open={showAddUserPopup} onClose={() => setShowAddUserPopup(false)}>
                {/* Add User POPUP */}
    
  <DialogTitle>Add New User</DialogTitle>
  <DialogContent>
    <TextField
      label="Name"
      variant="outlined"
      fullWidth
      margin="normal"
      value={newUser.name}
      onChange={handleAddUserInputChange}
      name="name"
    />
    <TextField
      label="Username"
      variant="outlined"
      fullWidth
      margin="normal"
      value={newUser.username}
      onChange={handleAddUserInputChange}
      name="username"
    />
    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      margin="normal"
      value={newUser.email}
      onChange={handleAddUserInputChange}
      name="email"
    />
    <TextField
      label="Password"
      variant="outlined"
      fullWidth
      margin="normal"
      type="password"
      value={newUser.password}
      onChange={handleAddUserInputChange}
      name="password"
    />
    <TextField
      label="Role"
      variant="outlined"
      fullWidth
      margin="normal"
      value={newUser.role}
      onChange={handleAddUserInputChange}
      name="role"
      InputProps={{
        readOnly: true,  // Makes the input field read-only
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowAddUserPopup(false)} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleAddUserSubmit} color="primary">
      Add User
    </Button>
  </DialogActions>
</Dialog>

        {/* Regular Users List */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Regular Users
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* pending user popup */}

        <Dialog open={showPendingPopup} onClose={() => setShowPendingPopup(false)}>
  <DialogTitle>Pending User Requests</DialogTitle>
  <DialogContent>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleApprove(user._id)}>
                  Approve
                </Button>
                <Button color="error" onClick={() => handleReject(user._id)}>
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowPendingPopup(false)} color="secondary">
      Close
    </Button>
  </DialogActions>
</Dialog>

        {/* Admins List */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Admins (Non-editable)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Edit User Popup */}
        <Dialog open={showEditPopup} onClose={() => setShowEditPopup(false)}>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedUser?.name || ''}
              onChange={handleInputChange}
              name="name"
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedUser?.username || ''}
              onChange={handleInputChange}
              name="username"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedUser?.email || ''}
              onChange={handleInputChange}
              name="email"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditPopup(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UMDashboard;

