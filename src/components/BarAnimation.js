import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { BarChart } from '@mui/x-charts';

export default function BarAnimation() {
  const [seriesNb, setSeriesNb] = React.useState(5);
  const [itemNb, setItemNb] = React.useState(10);

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };
  const handleSeriesNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setSeriesNb(newValue);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <style>{`
        .x-charts-line {
          stroke: white; /* Change the color of the axis lines */
        }
        .x-charts-tick {
          stroke: white; /* Change the color of the tick marks */
        }
      `}</style>
      <BarChart
        height={300}
        slotProps={{ legend: { hidden: true } }}
        series={series
          .slice(0, seriesNb)
          .map((s) => ({ ...s, data: s.data.slice(0, itemNb), showLabels: false }))}
      />
      <Typography id="input-item-number" gutterBottom>
        Slide to change the number of Departments
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={10}
        aria-labelledby="input-item-number"
      />
      <Typography id="input-series-number" gutterBottom>
        Slide to change the number of Employees
      </Typography>
      <Slider
        value={seriesNb}
        onChange={handleSeriesNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={5}
        aria-labelledby="input-series-number"
      />
    </Box>
  );
}

const series = [
  {
    label: 'series 1',
    data: [
      2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 1269,
    ],
    showLabels: false,
    color: '#a6cee3',
  },
  {
    label: 'series 2',
    data: [
      2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 2031,
    ],
    showLabels: false,
    color: '#1f78b4',
  },
  {
    label: 'series 3',
    data: [
      1145, 1214, 975, 2266, 1768, 2341, 747, 1282, 1780, 1766,
    ],
    showLabels: false,
    color: '#66c2a5',
  },
  {
    label: 'series 4',
    data: [
      2361, 979, 2430, 1768, 1913, 2342, 1868, 1319, 1038, 2139,
    ],
    showLabels: false,
    color: '#17becf',
  },
  {
    label: 'series 5',
    data: [
      968, 1371, 1381, 1060, 1327, 934, 1779, 1361, 878, 1055,
    ],
    showLabels: false,
    color: '#4e79a7',
  },
].map((s) => ({ ...s, highlightScope: { highlighted: 'series', faded: 'global' } }));
