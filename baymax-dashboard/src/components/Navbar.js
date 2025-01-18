import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hooks

function Navbar({ onModeChange }) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0(); // Auth0 hooks
  const [mode, setMode] = useState("adult"); // Default mode is 'Adult Mode'
  const [menuOpen, setMenuOpen] = useState(false);

  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    if (onModeChange) {
      onModeChange(selectedMode); // Notify the parent component (e.g., App.js) about the mode change
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="static"
      style={{
        background:
          "linear-gradient(90deg, rgba(94,114,228,1) 0%, rgba(72,98,190,1) 100%)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand/Title */}
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            color: "white",
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          Baymax Dashboard
        </Typography>

        {/* Navigation Links and Mode Selector */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
          }}
        >
          <Button
            component={Link}
            to="/"
            color="inherit"
            style={{
              marginRight: "15px",
              color: "white",
              fontWeight: "bold",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#FFD700")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/patient-info"
            color="inherit"
            style={{
              marginRight: "15px",
              color: "white",
              fontWeight: "bold",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#FFD700")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Patient Info
          </Button>

          {/* Mode Selector */}
          <Select
            value={mode}
            onChange={handleModeChange}
            style={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "5px",
              marginRight: "15px",
              padding: "5px 15px",
              fontWeight: "bold",
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#5e72e4",
                  color: "white",
                },
              },
            }}
          >
            <MenuItem value="child">Child Mode</MenuItem>
            <MenuItem value="adult">Adult Mode</MenuItem>
            <MenuItem value="doctor">Doctor Mode</MenuItem>
          </Select>

          {/* Conditional Login/Logout Buttons */}
          {isAuthenticated ? (
            <Button
              onClick={() => logout({ returnTo: window.location.origin })}
              style={{
                backgroundColor: "#FF4B4B",
                color: "white",
                fontWeight: "bold",
                borderRadius: "5px",
                marginLeft: "15px",
                padding: "10px 20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                onClick={() => loginWithRedirect()}
                style={{
                  backgroundColor: "#4B4BFF",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  marginLeft: "15px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  marginLeft: "15px",
                  padding: "10px 20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleMenu}
        >
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
      </Toolbar>

      {/* Dropdown for Mobile */}
      {menuOpen && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            backgroundColor: "#5e72e4",
            padding: "10px",
          }}
        >
          <Button
            component={Link}
            to="/"
            fullWidth
            style={{
              color: "white",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/patient-info"
            fullWidth
            style={{
              color: "white",
              textAlign: "left",
              marginBottom: "10px",
            }}
          >
            Patient Info
          </Button>
          <Select
            value={mode}
            onChange={handleModeChange}
            fullWidth
            style={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              marginBottom: "10px",
              padding: "10px",
              fontWeight: "bold",
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#5e72e4",
                  color: "white",
                },
              },
            }}
          >
            <MenuItem value="child">Child Mode</MenuItem>
            <MenuItem value="adult">Adult Mode</MenuItem>
            <MenuItem value="doctor">Doctor Mode</MenuItem>
          </Select>
          {isAuthenticated ? (
            <Button
              onClick={() => logout({ returnTo: window.location.origin })}
              fullWidth
              style={{
                backgroundColor: "#FF4B4B",
                color: "white",
                fontWeight: "bold",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                onClick={() => loginWithRedirect()}
                fullWidth
                style={{
                  backgroundColor: "#4B4BFF",
                  color: "white",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                fullWidth
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Box>
      )}
    </AppBar>
  );
}

export default Navbar;
