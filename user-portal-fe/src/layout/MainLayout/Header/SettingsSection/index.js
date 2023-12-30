import { useState, useRef, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  useMediaQuery, Popper,
  Paper,
  ClickAwayListener,
  Grid, Stack, Typography, Chip, Divider
} from '@mui/material';
import Settings from './settings';
import MainCard from 'ui-component/cards/MainCard';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Transitions from 'ui-component/extended/Transitions';
// assets
import { IconSettings } from '@tabler/icons';

const SettingsSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 1,
          [theme.breakpoints.down('md')]: {
            mr: 1
          }
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.primary.light,
              color: theme.palette.secondary.dark,
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconSettings stroke={1.5} size="1.3rem" color='black' />
          </Avatar>
        </ButtonBase>
        <Popper
          placement={matchesXs ? 'bottom' : 'bottom-end'}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [matchesXs ? 5 : 0, 20]
                }
              }
            ]
          }}
        >
          {({ TransitionProps }) => (
            <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={handleToggle}>
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">All Notification</Typography>
                              <Chip
                                size="small"
                                label="01"
                                sx={{
                                  color: theme.palette.background.default,
                                  bgcolor: theme.palette.warning.dark
                                }}
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PerfectScrollbar
                          style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                        >
                          <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                              <Settings />
                            </Grid>
                            <Grid item xs={12} p={0}>
                              <Divider sx={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          {/* <NotificationList /> */}
                        </PerfectScrollbar>
                      </Grid>
                    </Grid>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      </Box>
    </>
  );
};

export default SettingsSection;
