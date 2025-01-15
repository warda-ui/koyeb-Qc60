import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Typography } from '@mui/material';
import { Home, AccountBox, LibraryBooks, ExitToApp, Chat } from '@mui/icons-material';
import './UserDashboard.css'; // Import the custom styles
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [tempQuote, setTempQuote] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState('');
    const [quotes, setQuotes] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        username: '',
        email: '',
        role: '',
        status: '',
    });
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserName(decodedToken.name);
                setStatus(decodedToken.status);

                await fetchQuote();
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch username", err);
                setError('Failed to load user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile-data', {
                headers: { 'x-access-token': token },
            });
            const data = await response.json();
            if (data.status === 'ok') {
                setProfileData(data.profile);
            } else {
                alert('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };
    
    const saveProfileChanges = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        const data = await response.json();
        if (data.status === 'ok') {
            alert('Profile updated successfully');
            setShowProfileModal(false);
        } else {
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
};


    async function fetchQuote() {
        try {
            const response = await fetch('/api/quote', {
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            if (data.status === 'ok' && data.quote) {
                setQuotes([data.quote]);
            } else {
                alert(data.error || 'No quote found');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            setError('Failed to fetch quote');
        }
    }

    async function updateQuote(e) {
        e.preventDefault();
        if (status === 'pending' && quotes.length >= 1) {
            alert("Your Status is Pending. You can add only one quote.");
            return;
        } else if (status === 'approved' && quotes.length >= 3) {
            alert("You can only have a maximum of 3 quotes.");
            return;
        }

        try {
            const req = await fetch('/api/quote', {
                method: 'POST',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quote: tempQuote }),
            });

            if (!req.ok) {
                throw new Error('Failed to update quote');
            }

            const data = await req.json();
            if (data.status === 'ok') {
                setTempQuote('');
                setQuotes([...quotes, data.quote]);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    const deleteQuote = async (quoteToDelete) => {
        try {
            const updatedQuotes = quotes.filter(q => q !== quoteToDelete);
            setQuotes(updatedQuotes);

            await fetch('/api/quote', {
                method: 'DELETE',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quote: quoteToDelete }),
            });
        } catch (err) {
            alert('Failed to delete quote');
        }
    };

    const editQuote = async (index, newQuote) => {
        const updatedQuotes = [...quotes];
        updatedQuotes[index] = newQuote;
        setQuotes(updatedQuotes);

        try {
            await fetch('/api/quote', {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quote: newQuote }),
            });
        } catch (err) {
            alert('Failed to update quote');
        }
    };

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error}</h1>;

    return (
        <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <header className="dashboard-header">
                <IconButton className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    &#9776;
                </IconButton>
                <Typography variant="h5">Welcome, {userName || 'name'}!</Typography>
                <Typography variant="subtitle1">Your Status: {status === 'pending' ? status : 'Approved'}</Typography>
            </header>

            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <Button startIcon={<Home />} onClick={() => navigate('/')}>Home</Button>
                <Button startIcon={<AccountBox />} onClick={() => navigate('/view-profile')}>View Profile</Button>
                <Button startIcon={<LibraryBooks />} onClick={() => navigate('/launch-complaint')}>Launch Complaint</Button>
                <Button startIcon={<Chat />} onClick={() => navigate('/complaint-status')}>Complaint Status</Button>
                <Button startIcon={<ExitToApp />} onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}>Logout</Button>
            </div>

            <main className="dashboard-main">
                <div className="main-buttons">
                <Button
    variant="contained"
    color="primary"
    onClick={() => {
        fetchProfileData();
        setShowProfileModal(true);
    }}
    startIcon={<AccountBox />}
>
    View Profile
</Button>

                    <Button variant="contained" color="secondary" onClick={() => navigate('/complaint-form')} startIcon={<LibraryBooks />}>Launch Complaint</Button>
                    <Button variant="contained" color="success" onClick={() => navigate('/complaint-status')} startIcon={<Chat />}>Complaint Status</Button>
                </div>
<Modal open={showProfileModal} onClose={() => setShowProfileModal(false)}>
    <div className="profile-modal">
        <h2>View Profile</h2>
        <TextField
            label="Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            fullWidth
        />
        <TextField
            label="Username"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            fullWidth
        />
        <TextField
            label="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            fullWidth
        />
        <TextField
            label="Role"
            value={profileData.role}
            disabled
            fullWidth
        />
        <TextField
            label="Status"
            value={profileData.status}
            disabled
            fullWidth
        />
        <Button variant="contained" color="primary" onClick={saveProfileChanges}>
            Save
        </Button>
    </div>
</Modal>


                <div className="quote-section">
                    <h2>Your Quotes:</h2>
                    <div className="quote-display">
                        {quotes.length > 0 ? (
                            quotes.map((q, index) => (
                                <div key={index} className="quote-item">
                                    <Typography variant="body1">{q}</Typography>
                                    <Button onClick={() => editQuote(index, prompt('Edit your quote:', q))} variant="outlined" color="primary">Edit</Button>
                                    <Button onClick={() => deleteQuote(q)} variant="outlined" color="error">Delete</Button>
                                </div>
                            ))
                        ) : (
                            <Typography variant="body2">No Quotes Found</Typography>
                        )}
                    </div>

                    {status === 'pending' && quotes.length === 0 && (
                        <Typography variant="body2" color="error">Your Status is pending. Wait for approval to add more Quotes.</Typography>
                    )}

                    {status !== 'pending' && quotes.length < 3 && (
                        <form onSubmit={updateQuote} className="quote-form">
                            <input
                                type="text"
                                placeholder="Enter your quote"
                                value={tempQuote}
                                onChange={e => setTempQuote(e.target.value)}
                                className="quote-input"
                            />
                            <Button type="submit" variant="contained" color="primary">Add Quote</Button>
                        </form>
                    )}

                    {status === 'pending' && quotes.length === 0 && (
                        <form onSubmit={updateQuote} className="quote-form">
                            <input
                                type="text"
                                placeholder="Enter your quote"
                                value={tempQuote}
                                onChange={e => setTempQuote(e.target.value)}
                                className="quote-input"
                            />
                            <Button type="submit" variant="contained" color="primary">Add 1 Quote</Button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
