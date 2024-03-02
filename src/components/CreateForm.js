import React, { useState } from 'react';
import axios from 'axios';

function CreateForm() {
    const [formData, setFormData] = useState({
        form_id: '',
        filled: false,
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        questions: [{ question_id: '', question: '', rating: 0 }]
    });
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
            await axios.post('http://localhost:8000/form', formData);
            alert('Form created successfully');
            // should redirect back to displaying forms page
        } catch (error) {
            console.error('Error creating form:', error);
            alert('Error creating form. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="form_id">Form ID:</label>
                    <input type="number" id="form_id" name="form_id" value={formData.form_id} onChange={(e) => setFormData({ ...formData, form_id: e.target.value })} required />
                </div>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div>
                    <label htmlFor="start_time">Start Time:</label>
                    <input type="datetime-local" id="start_time" name="start_time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} required />
                </div>
                <div>
                    <label htmlFor="end_time">End Time:</label>
                    <input type="datetime-local" id="end_time" name="end_time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} required />
                </div>
                <div>
                    <h3>Questions</h3>
                    {formData.questions.map((question, index) => (
                        <div key={index}>
                            <label htmlFor={`question_${index}`}>Question {index + 1}:</label>
                            <input type="text" id={`question_${index}`} name="question" value={question.question} onChange={(e) => handleChange(e, index)} required />
                            <button type="button" onClick={() => removeQuestion(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion}>Add Question</button>
                </div>
                <button type="submit">Create Form</button>
            </form>
        </div>
    );
}

export default CreateForm;
