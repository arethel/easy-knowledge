import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const MyCircularProgress = ({ props, progress, determinate }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {determinate ? (
          <>
            <CircularProgress
              variant="determinate"
              sx={{
                color: (theme) =>
                  theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
                animationDuration: '550ms',
                left: 0,
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: 'round',
                },
              }}
              size={40}
              thickness={4}
              value={progress}
              {...props}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="var(--collection-1-font-3)">
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </>
        ) : (
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
              animationDuration: '550ms',
              position: 'absolute',
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round',
              },
            }}
            size={40}
            thickness={4}
            {...props}
          />
        )}
      </Box>
    </Box>
  );
};
