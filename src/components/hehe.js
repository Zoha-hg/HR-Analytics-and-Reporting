import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS} from 'chart.js/auto'; // Import Chart.js
import { Bar, Doughnut, Line } from 'react-chartjs-2'; // Import React-ChartJS-2
import './DisplayForm.css';
import dashboard_icon from './assets/Dashboard.png';
import employee_icon from './assets/Employee.svg';
import feedback_icon from './assets/Feedback.svg';
import turnover_icon from './assets/Turnover.svg';
import calendar_icon from './assets/Calendar.svg';
import gmail_icon from './assets/Turnover.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar , Container, Row, Col } from 'react-bootstrap';

function DisplayResults()
{
    const [results, setResults] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [has_data, setHasData] = useState(false);
    const navigate = useNavigate();

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

                // let has_data = false;
                console.log(response.data[0].total_rating);
                let t = response.data[0].total_rating;
                if((t !== null)&&(t !== 0))
                {

                    setHasData(true);
                }
                else
                {
                    setHasData(false);
                }

            } catch (error) {
                console.error('Error fetching results:', error);
            }
        }
        // const has_data = results.length === 0;
        fetchData();


    },[]);

    
    return (
        
        <div>
             <Container fluid>
                <Row>
                    <Col sm={1} className="bg-light" style={{height: "100vh"}}>
                        <Navbar bg="light" expand="lg">
                            {/* <Navbar.Brand href="#home">Feedback System</Navbar.Brand> */}
                            <div className='side-panel'>
                                <ul>
                                    <li><button onClick={() => {navigate("/dashboard")}}><img src={dashboard_icon} alt="Dashboard"></img></button></li>
                                    <li><button onClick={() => {navigate("/employee")}}><img src={employee_icon} alt="Employee"></img></button></li>
                                    <li><button onClick={() => {navigate("/turnover")}}><img src={turnover_icon} alt="Turnover"></img></button></li>
                                    <li><button onClick={() => {navigate("/feedbackform")}}><img src={feedback_icon} alt="Feedback"></img></button></li>
                                    <li><button onClick={() => {navigate("/calendar")}}><img src={calendar_icon} alt="Calendar"></img></button></li>
                                    <li><button onClick={() => {navigate("/email")}}><img src={calendar_icon} alt="Email"></img></button></li>
                                </ul>
                            </div>
                        </Navbar>
                    </Col>
                    <Col sm={9} className="bg-white" style={{height: "100vh"}}>
                        <h1>Results for form {form_id}</h1>
                        {!has_data && (
                            <div>
                                <h2>No responses</h2>
                            </div>
                        )}
                        {has_data && (
                            <div>
                                <h2>Responses</h2>
                                <label>
                                    <input type="checkbox" checked={chartType === 'doughnut'} onChange={toggleChart} />
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
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
                        )}
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
    
}
export default DisplayResults;