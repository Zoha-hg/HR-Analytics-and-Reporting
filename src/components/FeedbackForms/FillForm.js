import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Fillform.css';

function FillForm() {
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form_data, setForm] = useState(null);
    const [user_role, setUserRole] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);

    const navigate = useNavigate();
    let ans = [];

    const match = window.location.href.match(/[?&]feedback_id=([^&]*)/);
    const form_id = match ? match[1] : null;

    const setAns = (index, value) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers]; // Create a copy of the previous answers array
            updatedAnswers[index] = value; // Update the value at the specified index
            return updatedAnswers; // Return the updated array
        });
        console.log("answers ", answers);
    };

    useEffect(() => {
        
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            try {
                // Make a GET request to the /user-role endpoint to extract the user's role based on the token
                const response = await axios.get('http://localhost:8000/user-role', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // setUserRole(response.data.role);
                console.log("response ",response.data.role)
                // console.log("user_role: ", user_role);
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
                setUser(response.data.username);
                return response.data.username;
                
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };

        const getFormData = async () => {
            try{
                const form_data = await axios.post('http://localhost:8000/getform', {form_id: form_id});
                if(form_data.data !== "error")
                {
                    setForm(form_data.data);
                    console.log("length ",form_data.data.questions.length);

                    for(let i = 0; i < form_data.data.questions.length; i++)
                    {
                        ans.push(0);
                    };
                    console.log("ans ", ans);
                }
            }
            catch(error)
            {
                console.log(error);
            }
        }

        const getForms = async () => {
            let ur = await fetchUserRole();
            let username = await fetchUserName();
            setUserRole(ur);
            setUser(username);
            console.log("user_role: ", ur, "form id", form_id, "user ", username);
            await getFormData();
        }

        getForms();
    }, [form_id]);

    const onSubmit = () => {
        try
        {
            // setAnswers(ans);
            console.log("answers! ", answers);
            if(answers.length != form_data.questions.length)
            {
                alert("Please fill all the questions");
                return;
            }
            const response = axios.post('http://localhost:8000/fillform', {form_id: form_id, employee_id: user, user_role: user_role, answers: answers});
            alert("filled form successfully!!");
            navigate('/feedbackform');
            if(response.data === "error")
            {
                setError("Error submitting form");
            }
            else
            {
                alert("Form submitted successfully");
            }
        }
        catch(error)
        {
            console.log(error);
        }

    }

    const handleCircleClick = (index, value) => {
        setSelectedValue(value);
        setAns(index, value);
    };
    
    return (
        <div>
            <h1>Fill Form</h1>
            {form_data &&(
                <div>
                    <h2>{form_data.title}</h2>
                    <p>{form_data.description}</p>
                </div>
            )}
            {form_data && form_data.questions.map((question, index) => (
                <div key={index}> {/* Added key prop here */}
                    <label>{index} {question.question}</label>
                    <button onClick={() => handleCircleClick(index, 1)}> 1</button>
                    <button onClick={() => handleCircleClick(index,2)}> 2</button>
                    <button onClick={() => handleCircleClick(index,3)}> 3</button>
                    <button onClick={() => handleCircleClick(index,4)}> 4</button>
                    <button onClick={() => handleCircleClick(index,5)}> 5</button>
                    {/* <div className="circle-container">
                        {[1, 2, 3, 4, 5].map(value => (
                            <div
                                key={value}
                                className={`circle ${selectedValue === value ? 'selected' : ''}`}
                                onClick={() => handleCircleClick(index, value)}
                            ></div>
                        ))}
                    </div> */}
                </div>
            ))}
            <button onClick={onSubmit}>Submit</button> {/* Fixed typo onSumbit to onSubmit */}
        </div>
    );
}

export default FillForm;
