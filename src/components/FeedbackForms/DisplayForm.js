import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



function DisplayForms() {
    
    const [forms, setForms] = useState([]);
    const [username, setUsername] = useState('');
    const [user_role, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            try {
                // Make a GET request to the /user-role endpoint to extract the user's role based on the token
                const response = await axios.get('http://localhost:8000/user-role', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserRole(response.data.role);
                console.log("response ",response.data.role)
                console.log("user_role: ", user_role);
                return response.data.role;

            } catch (error) {
                console.error('Error fetching user role:', error);
                // If there's an error, redirect to the login page
                alert('Failed to fetch user role. Please log in again.');
                navigate('/login');
            }
        };

        const fetchUserName = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8000/user-name', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
                return response.data.username;
                
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        
        const fetchData = async (username, role) => {
            try {
                console.log("role ", role, "!", username);
                const response = await axios.post('http://localhost:8000/displayforms', {user: username, user_role: role});
                // console.log("response.data: ", response.data);
                setForms(response.data);
                if(user_role === "HR professional")
                {
                    console.log("user_roleeee: ", user_role);
                }
                else
                {
                    console.log("user_role: ", user_role);
                }
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        const getData = async () => {
            let role = await fetchUserRole();
            let username = await fetchUserName();
            fetchData(username, role);
            // setUsername(username);
        }

        getData();
    }, []);

    const handleGoToForm = async (form_id) =>
    {
        // const user_role = getUserRole(username);
        if((user_role === "Employee")||(user_role === "Manager"))
        {
            console.log("going to form " + form_id);
            window.location.href = '/feedbackform/fillform/?feedback_id=' + form_id;
        }
        else
        {
            console.log("going to display form results");
            window.location.href = '/feedbackform/displayresults/?form_id=' + form_id;
        }
    }

    const filledForms = forms.filter(form => form.filled || new Date(form.end_time) < new Date());
    const unfilledForms = forms.filter(form => !form.filled && (new Date(form.start_time) <= new Date() && new Date(form.end_time) >= new Date()));

    const endedForms = forms.filter(form => new Date(form.end_time) < new Date());
    const ongoingForms = forms.filter(form => new Date(form.start_time) <= new Date() && new Date(form.end_time) >= new Date());

    return (
        <div>
            
            <div>
                {user_role === "HR professional" && (
                    <div>
                        <h1>Feedback Forms</h1>
                        <Link to="/feedbackform/createform"><button>Create a Form</button></Link>
                        <h2>Finished</h2>
                        <ul>
                            {endedForms.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {endedForms.map(form => (
                                        <li key={form.form_id}>
                                            <button type="button" onClick={() => handleGoToForm(form.form_id)}>
                                                <h3>{form.title}</h3>
                                                <p>{form.description}</p>
                                                <p>Start Time: {form.start_time}</p>
                                                <p>End Time: {form.end_time}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </ul>
                        <h2>Ongoing</h2>
                        <ul>
                            {ongoingForms.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {ongoingForms.map(form => (
                                        <li key={form.form_id}>
                                                <h3>{form.title}</h3>
                                                <p>{form.description}</p>
                                                <p>Start Time: {form.start_time}</p>
                                                <p>End Time: {form.end_time}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </ul>
                    </div>
                )}

                {user_role === "Employee" && (
                    <div>
                        <h1>Feedback Forms</h1>
                        <div  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
                            <div className='incomplete-forms' >
                                <h2>Incomplete</h2>
                                <ul className='form-display'>
                                    {unfilledForms.length > 0 ? (
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {unfilledForms.map(form => (
                                                <li key={form.form_id}>
                                                    <button className="form-button" type="button" onClick={() => handleGoToForm(form.form_id)}>
                                                        <h3>{form.title}</h3>
                                                        <p>{form.description}</p>
                                                        <p>Start Time: {form.start_time}</p>
                                                        <p>End Time: {form.end_time}</p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>None</p>
                                    )}
                                </ul>
                            </div>
                            <div className='complete-forms'>
                                <h2>Complete</h2>
                                <ul>
                                    {filledForms.length > 0 ? (
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {filledForms.map(form => (
                                                <li key={form.form_id}>
                                                        <h3>{form.title}</h3>
                                                        <p>{form.description}</p>
                                                        <p>Start Time: {form.start_time}</p>
                                                        <p>End Time: {form.end_time}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>None</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {user_role === "Manager" && (
                    <div>
                        <h1>Feedback Forms</h1>
                        <h2>Incomplete</h2>
                        <ul>
                            {unfilledForms.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {unfilledForms.map(form => (
                                        <li key={form.form_id}>
                                            <button type="button" onClick={() => handleGoToForm(form.form_id)}>
                                                <h3>{form.title}</h3>
                                                <p>{form.description}</p>
                                                <p>Start Time: {form.start_time}</p>
                                                <p>End Time: {form.end_time}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </ul>
                        <h2>Complete</h2>
                        <ul>
                            {filledForms.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {filledForms.map(form => (
                                        <li key={form.form_id}>
                                                <h3>{form.title}</h3>
                                                <p>{form.description}</p>
                                                <p>Start Time: {form.start_time}</p>
                                                <p>End Time: {form.end_time}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DisplayForms;