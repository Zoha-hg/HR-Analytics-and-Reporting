import { makeStyles } from '@mui/styles';

const useSkillRatingsChartStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '15px',
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: '20px',
    padding: '20px',
    boxSizing: 'border-box',
  },
  chartContainer: {
    display: 'flex', // Use flex for layout
    flexDirection: 'column', // Stack children vertically
    alignItems: 'center', // Center-align horizontally
    justifyContent: 'center', // Center-align vertically
    width: '100%', // Container takes full width of parent
    maxWidth: '250px', // Max width is constrained
    margin: 'auto', // Center-align the container itself
    border: '1px solid #E0E0E0', // Border for the container
    borderRadius: '16px', // Rounded corners
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Box shadow for depth
    padding: theme.spacing(3), // Use theme spacing for consistent padding
    backgroundColor: '#fff', // White background
    
  },
}));

export default useSkillRatingsChartStyles;
