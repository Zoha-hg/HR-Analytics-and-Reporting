import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut} from 'react-chartjs-2'; // Import React-ChartJS-2
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
function DisplayResults()
{
    const [results, setResults] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [has_data, setHasData] = useState(false);
    const [formdata, setData] = useState(false);
    const [form, setForm] = useState({});
    const [gotData, setGotData] = useState(false);
    const navigate = useNavigate();


    const match = window.location.href.match(/[?&]form_id=([^&]*)/);
    const form_id = match ? match[1] : null;


    useEffect(() => {
        const getFormData = async () => {
            try{
                const form_data = await axios.post('http://localhost:8000/getform', {form_id: form_id});
                if(form_data.data !== "error")
                {
                    setForm(form_data.data);
                    setData(true);
                }
            }
            catch(error)
            {
                console.log(error);
            }
        }
        const fetchData = async () => {
            try
            {
                const response = await axios.post('http://localhost:8000/displayresults', {form_id: form_id});
                console.log("response.data: ", response.data);
                // setResults(response.data);

                console.log("total rating", response.data);
                let t = response.data[0].total_rating;
                if((t !== null)&&(t !== 0))
                {
                    
                    console.log("t", t);
                    setHasData(true);
                }
                else
                {
                    setHasData(false);
                }
                console.log("returning data");
                return response.data;
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        }

        const setRes = async (res) => {
            setResults(res);
            return true;
        }
        const yo = async () => {
            if(!formdata)
            {
                await getFormData();
                let res = await fetchData();
                console.log("res",res);
                if(setRes(res))
                {
                    // console.log("statement", (res[0].rating1 === 1));
                    // if(res.lenth > 0)
                    // {
                        if((res[0].rating1 === 1) || (res[0].rating2 == 1) || (res[0].rating3 == 1) || (res[0].rating4 == 1) || (res[0].rating5 == 1))
                        {

                            setGotData(true);
                            // console.log("WHaaat", has_data, res);
                        }
                    // }
                }
            }
        }
        // getFormData();
        // let res = fetchData();
        // console.log("res",res);
        
        yo();
        const getData = async () => {
            let res = await fetchData();
            const setRes = async () => {
                setResults(res);
                return true;
            }
            if(setRes())
            {
                setGotData(true);
                console.log("has_data", has_data, res);
    
            }
            if(gotData && results.length > 0)
            {
                console.log("results!!", results);
            }
        }
        if(formdata)
        {
            getData();
        }
    },[]);

    return (
        
        <div>        
            <div className='container'>
                <h1 >Results for form {form.title}</h1>
                <h3 style={{ marginBottom: '0px'}}>{form.description}</h3>

                {!gotData && (
                    <div>
                        <h2>No responses</h2>
                    </div>
                )}
                {gotData && (
                    <div>
                        <h2>{results.total_rating} Responses</h2>
                        <div className="chart-options">
                        <label>
                            <input 
                            type="radio" 
                            value="bar" 
                            checked={chartType === 'bar'} 
                            onChange={() => setChartType('bar')} 
                            />
                            Bar Chart
                        </label>
                        <label>
                            <input 
                            type="radio" 
                            value="doughnut" 
                            checked={chartType === 'doughnut'} 
                            onChange={() => setChartType('doughnut')} 
                            />
                            Doughnut Chart
                        </label>
                        </div>

                        <div className='graphs'>
                            {results.map(({ question, rating1, rating2, rating3, rating4, rating5 }, index) => (
                                <div key={question}>
                                    <h3>Q{index+1}. {question}</h3>
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
                                            options={{
                                                scales: {
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Rating',
                                                            color: 'black' // Change color if needed
                                                        }
                                                    },
                                                    y: {
                                                        title: {
                                                            display: true,
                                                            text: 'No. of Employees',
                                                            color: 'black' // Change color if needed
                                                        }
                                                    }
                                                }
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
                )}
            </div>
        </div>
    );
    
}
export default DisplayResults;