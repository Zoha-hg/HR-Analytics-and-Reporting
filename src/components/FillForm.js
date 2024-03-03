import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FillForm() {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        // Fetch existing forms from the backend when the component mounts
        const fetchForms = async () => {
            try {
                const response = await axios.get('http://localhost:8000/forms'); // Adjust the API endpoint accordingly
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };

        fetchForms();
    }, []);

    const handleFormSelect = (form) => {
        // Set the selected form and initialize answers array
        setSelectedForm(form);
        setAnswers(new Array(form.questions.length).fill(''));
    };

    const handleInputChange = (index, value) => {
        // Update answers array as user fills the form
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Submit filled form to the backend
            await axios.post('http://localhost:8000/fillform', {
                form_id: selectedForm.form_id,
                employee_id: selectedForm.employee_id,
                answers: answers,
            });
            alert('Form filled successfully');
            // Optionally, you can display a success message or redirect the user
        } catch (error) {
            console.error('Error filling form:', error);
            // Handle error
            alert('Error filling form. Please try again.');
        }
    };

    return (
        <div>
            <h2>Fill Form</h2>
            <div>
                <h3>Select Form to Fill:</h3>
                <ul>
                    {forms.map((form) => (
                        <li key={form.form_id} onClick={() => handleFormSelect(form)}>
                            {form.title}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedForm && (
                <div>
                    <h3>Fill Form: {selectedForm.title}</h3>
                    <form onSubmit={handleSubmit}>
                        {selectedForm.questions.map((question, index) => (
                            <div key={index}>
                                <label htmlFor={`question_${index}`}>{question}</label>
                                <input
                                    type="text"
                                    id={`question_${index}`}
                                    name={`question_${index}`}
                                    value={answers[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default FillForm;
