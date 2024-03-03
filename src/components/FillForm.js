import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FillForm() {
    const [formData, setFormData] = useState({
        form_id: '',
        employee_id: '',
        answers: [] 
    });

    const [formQuestions, setFormQuestions] = useState([]);

    // Function to fetch form questions based on form ID
    const fetchFormQuestions = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/getformquestions/${formData.form_id}`);
            setFormQuestions(response.data.questions);
        } catch (error) {
            console.error('Error fetching form questions:', error);
        }
    };

    // Function to handle input change for each question
    const handleAnswerChange = (e, index) => {
        const newAnswers = [...formData.answers];
        newAnswers[index] = e.target.value;
        setFormData({
            ...formData,
            answers: newAnswers
        });
    };

    // Function to submit filled form
    const handleSubmitForm = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            await axios.post('http://localhost:8000/fillform', formData);
            alert('Form submitted successfully');
            // Redirect or perform any action after successful form submission
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    useEffect(() => {
        fetchFormQuestions();
    }, []);

    return (
        <div>
            <h1>Fill Form</h1>
            <form onSubmit={handleSubmitForm}>
                {formQuestions.map((question, index) => (
                    <div key={index}>
                        <label htmlFor={`question_${index}`}>{question}</label>
                        <input
                            type="text"
                            id={`question_${index}`}
                            value={formData.answers[index] || ''}
                            onChange={(e) => handleAnswerChange(e, index)}
                            required
                        />
                    </div>
                ))}
                <button type="submit">Submit Form</button>
            </form>
        </div>
    );
}

export default FillForm;
