import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS} from 'chart.js/auto'; // Import Chart.js
import { Bar, Doughnut, Line } from 'react-chartjs-2'; // Import React-ChartJS-2

function DisplayResults()
{
    const [results, setResults] = useState([]);
    const [chartType, setChartType] = useState('bar');

    const toggleChart = () => {
        setChartType(chartType === 'bar' ? 'doughnut' : 'bar');
    };
    const match = window.location.href.match(/[?&]form_id=([^&]*)/);
    const form_id = match ? match[1] : null;
    useEffect(() => {

        const fetchData = async () => {
            try
            {
                const response = await axios.post('http://localhost:8000/displayresults', {form_id: form_id});
                console.log("response.data: ", response.data);
                setResults(response.data);

                

            } catch (error) {
                console.error('Error fetching results:', error);
            }
        }
        fetchData();


    },[]);

    return (
        <div>
            <h1>Results for form {form_id}</h1>
       
            <label>
                <input type="checkbox" checked={chartType === 'doughnut'} onChange={toggleChart} />
            </label>
            <div>
                {results.map(({ question, rating1, rating2, rating3, rating4, rating5 }) => (
                    <div key={question}>
                        <h2>{question}</h2>
                        {chartType === 'bar' ? (
                            <Bar
                                data={{
                                    labels: ['1', '2', '3', '4', '5'],
                                    datasets: [
                                        {
                                            label: 'Rating',
                                            data: [rating1, rating2, rating3, rating4, rating5],
                                        },
                                    ],
                                }}
                            />
                        ) : (
                            <Doughnut
                                data={{
                                    labels: ['1', '2', '3', '4', '5'],
                                    datasets: [
                                        {
                                            label: 'Rating',
                                            data: [rating1, rating2, rating3, rating4, rating5],
                                        },
                                    ],
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default DisplayResults;