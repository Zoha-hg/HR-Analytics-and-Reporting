import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

// import './CreateForm.css';

function CreateForm() {

    const [formData, setFormData] = useState({
        filled: false,
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        questions: [{ question_id: '', question: '', rating: 0 }]
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const questions = [...formData.questions];
        questions[index][name] = value;
        setFormData({
            ...formData,
            questions
        });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { question_id: '', question: '', rating: 0 }]
        });
    };

    const removeQuestion = (index) => {
        const questions = [...formData.questions];
        questions.splice(index, 1);
        setFormData({
            ...formData,
            questions
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const errors = validateForm(formData);
            if (Object.keys(errors).length === 0) {
                await axios.post('https://hr-analytics-and-reporting-production.up.railway.app/createform', formData);
                alert('Form created successfully');
                // should redirect back to displaying forms page
                navigate('/feedbackform');
            } else {
                setFormErrors(errors);
            }
        } catch (error) {
            console.error('Error creating form:', error);
            alert('Error creating form. Please try again.');
        }
    };

    const validateForm = (formData) => {
        let errors = {};

        if (!formData.title) {
            errors.title = 'Title is required';
        }

        if (!formData.description) {
            errors.description = 'Description is required';
        }

        if (!formData.start_time) {
            errors.start_time = 'Start Time is required';
        }

        if (!formData.end_time) {
            errors.end_time = 'End Time is required';
        }

        formData.questions.forEach((question, index) => {
            if (!question.question) {
                errors[`question_${index}`] = `Question ${index + 1} is required`;
            }
        });

        return errors;
    };

    return (
        <div>
            <div>
            <div>
                <div className="container forms-create">
                    <div>
                        <h1>Create Form</h1>   
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input type="text" id="title" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                {formErrors.title && <span className="error">{formErrors.title}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea class="fixed-size-textarea" id="description" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                                {formErrors.description && <span className="error">{formErrors.description}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="start_time">Start Time:</label>
                                <input type="datetime-local" id="start_time" name="start_time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} required />
                                {formErrors.start_time && <span className="error">{formErrors.start_time}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="end_time">End Time:</label>
                                <input type="datetime-local" id="end_time" name="end_time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} required />
                                {formErrors.end_time && <span className="error">{formErrors.end_time}</span>}
                            </div>
                            <div className="questions">
                                <h3>Questions</h3>
                                {formData.questions.map((question, index) => (
                                    <div  className='addqs' key={index}>
                                        <label htmlFor={`question_${index}`}>Question {index + 1}:</label>
                                        <input type="text" id={`question_${index}`} name="question" value={question.question} onChange={(e) => handleChange(e, index)} required />
                                        {formErrors[`question_${index}`] && <span className="error">{formErrors[`question_${index}`]}</span>}
                                        <button type="button" className="remove-question" onClick={() => removeQuestion(index)}>Remove</button>
                                    </div>
                                ))}
                                <button type="button" className="add-question" onClick={addQuestion}>Add Question</button>
                            </div>
                            <button type="submit" className="submit">Create Form</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default CreateForm;
