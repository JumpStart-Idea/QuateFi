import React, { useState, useEffect } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode, logout } from "state";
import profileImage from "assets/profile.jpeg";
import settingsIcon from "assets/settings-icon.png";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Function to get page title based on current route
  const getPageTitle = (pathname) => {
    const path = pathname.split('/')[1]; // Get the first part after /
    
    const titleMap = {
      '': 'Dashboard',
      'dashboard': 'Dashboard',
      'products': 'Products',
      'customers': 'Customers',
      'transactions': 'Transactions',
      'geography': 'Geography',
      'overview': 'Overview',
      'daily': 'Daily',
      'monthly': 'Monthly',
      'breakdown': 'Breakdown',
      'admin': 'Admin',
      'performance': 'Performance',
      'settings': 'Settings',
    };
    
    return titleMap[path] || 'Dashboard';
  };

  // Update document title when route changes
  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = `${pageTitle}`;
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    handleClose();
    navigate("/login");
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary[300]}>
            {currentPageTitle}
          </Typography>
        </FlexBetween>

       

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          
<IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton 
            onClick={() => navigate("/settings")}
            sx={{
              '& img': {
                filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)',
                width: '25px',
                height: '25px',
                transition: 'filter 0.3s ease',
              },
              '&:hover': {
                '& img': {
                  opacity: 0.8,
                }
              }
            }}
          >
            <img src={settingsIcon} alt="Settings" />
          </IconButton>
          

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left" sx={{ maxWidth: '150px', overflow: 'hidden' }}>
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ 
                    color: theme.palette.secondary[100],
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ 
                    color: theme.palette.secondary[200],
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
