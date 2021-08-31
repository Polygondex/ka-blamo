import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import withStyles from "@material-ui/core/styles/withStyles";
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import pdexIcon from '../images/pDexIcon2.png';
import apeModeIcon from '../images/apeModeIcon.svg';
import monkeyIcon from '../images/monkey.svg';
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  autocompleteSearch: {
    width: '32ch',
    margin: '0 16px',

  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  navBar: {
    backgroundColor: '#1D1D1D'
  },
  dex: {
    color: '#A874FF'
  },
  pdexIcon: {
    maxHeight: '40px',
    marginRight: '8px'
  },
  tokenIcon: {
    height: '16px',
    width: '16px',
    marginRight: '8px',
    border: 'none'
  },
  autocompleteOption: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    minWidth: '0',
    flexDirection: 'row'
  },
  autocompleteOptionWrapper: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    minWidth: '0',
  },
  apeModeIcon: {
    maxHeight: '26px',
  },
  apeModeOffIcon: {
    maxHeight: '26px',
    opacity: '0.4'
  },
  apeModeFormGroup: {

  }
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'darkGreen',
      },
      '&:hover fieldset': {
        borderColor: 'green',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
    color: 'white',
  },
})(TextField);

const PurpleSwitch = withStyles({
  switchBase: {
    color: '#A874FF',
    '&$checked': {
      color: '#A874FF',
    },
    '&$checked + $track': {
      backgroundColor: '#A874FF',
    },
  },
  checked: {},
  track: {},
})(Switch);

const NavBar = ({tokenList, apeMode}) => {
  const defaultProps = {
    options: tokenList,
    getOptionLabel: (option) => `${option.mdtTokenName} - ${option.mdtTokenSymbol}`,
    renderOption: (option) => (
        <React.Fragment>
          <div className={classes.autocompleteOption}>

            <img
                src={`https://polygondex.com/track/i/coinicons/by_0x/polygon/${option.mdtTokenAddr}.png`}
                alt="" className={classes.tokenIcon}
                onError={(e)=>{
                  e.target.onerror = null; e.target.src="https://polygondex.com/track/i/coinicons/missingicon.png"
                }}
            />
            <span className={classes.autocompleteOptionWrapper}>
            {option.mdtTokenSymbol} - {option.mdtTokenName}
          </span>
          </div>

        </React.Fragment>
    )
  };
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [apeModeActivated, setApeModeActivated] = React.useState(apeMode || false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleApeModeChange = (event) => {
    setApeModeActivated(event.target.checked);
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
      <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
      <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="show 11 new notifications" color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
  );

  return (
      <div className={classes.grow}>
        <AppBar position="static" className={classes.navBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <div className={classes.titleWrapper}>
              <img className={classes.pdexIcon} src={pdexIcon} alt='PDexLogo'/>
              <Typography className={classes.title} variant="h5" noWrap>
                Polygon
                <span className={classes.dex}>DEX</span>
              </Typography>
            </div>
            <div className={classes.grow} />
            <FormGroup aria-label="position" row className={classes.apeModeFormGroup}>
              <FormControlLabel
                  control={<PurpleSwitch checked={apeModeActivated} onChange={handleApeModeChange} name="checkedA"
                            icon={<img className={classes.apeModeOffIcon} src={apeModeIcon} alt='ApeMode Icon'/>}
                            checkedIcon={<img className={classes.apeModeIcon} src={apeModeIcon} alt='ApeMode Icon'/>}
                  />}
                  label="Custom color"
                  label="Ape Mode"
                  labelPlacement="top"
              />
            </FormGroup>

            <Autocomplete
                {...defaultProps}
                id="auto-complete"
                size={'small'}
                freeSolo
                PaperComponent={({children}) => (
                    <Paper style={{ background: "lightgrey" }}>{children}</Paper>
                )}
                closeIcon={<CloseIcon fontSize="small" style={{ color: 'red', marginLeft: 'auto' }} />}
                renderInput={(params) => (
                    <CssTextField
                        className={classes.autocompleteSearch}
                        {...params}
                        label="Crypto Quote"
                        margin="normal"
                        variant="outlined"
                        InputProps={{ ...params.InputProps, style: {color:'white'}, startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                          )
                        }}
                        InputLabelProps={{
                          style: {
                            color: 'white'
                          }
                        }}
                    />
                )}
            />
            {/*<div className={classes.sectionDesktop}>*/}
            {/*  <IconButton aria-label="show 4 new mails" color="inherit">*/}
            {/*    <Badge badgeContent={4} color="secondary">*/}
            {/*      <MailIcon />*/}
            {/*    </Badge>*/}
            {/*  </IconButton>*/}
            {/*  <IconButton aria-label="show 17 new notifications" color="inherit">*/}
            {/*    <Badge badgeContent={17} color="secondary">*/}
            {/*      <NotificationsIcon />*/}
            {/*    </Badge>*/}
            {/*  </IconButton>*/}
            {/*  <IconButton*/}
            {/*      edge="end"*/}
            {/*      aria-label="account of current user"*/}
            {/*      aria-controls={menuId}*/}
            {/*      aria-haspopup="true"*/}
            {/*      onClick={handleProfileMenuOpen}*/}
            {/*      color="inherit"*/}
            {/*  >*/}
            {/*    <AccountCircle />*/}
            {/*  </IconButton>*/}
            {/*</div>*/}
            {/*<div className={classes.sectionMobile}>*/}
            {/*  <IconButton*/}
            {/*      aria-label="show more"*/}
            {/*      aria-controls={mobileMenuId}*/}
            {/*      aria-haspopup="true"*/}
            {/*      onClick={handleMobileMenuOpen}*/}
            {/*      color="inherit"*/}
            {/*  >*/}
            {/*    <MoreIcon />*/}
            {/*  </IconButton>*/}
            {/*</div>*/}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
  );
}

export default NavBar
