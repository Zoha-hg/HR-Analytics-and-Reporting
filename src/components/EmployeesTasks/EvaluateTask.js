import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const EvaluateTask = () => {

    const [task, setTask] = useState({
        title: '',
        start_time: '',
        end_time: '',
        skills: []
    });
    const [username, setUsername] = useState('');
    const [user_role, setUserRole] = useState('');
    const navigate = useNavigate();

    const match = window.location.href.match(/[?&]task_id=([^&]*)/);
    const task_id = match ? match[1] : null;

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
        
        const getTask = async () => {
            const task_data = await axios.post("http://localhost:8000/gettask", {task_id: task_id});
            return task_data.data;
        }

        const getUSer = async () => {
            let role = await fetchUserRole();
            let username = await fetchUserName();

            setUserRole(role);
            setUsername(username);
        }
        const fetchData = async () => {
            
            let taskData = await getTask();
            setTask(taskData);
        };
    
        fetchData();
        getUSer();
    }, [task_id]); 


    const handleChange = (event, index) => {
        const { value } = event.target;
        console.log("Selected rating:", value, "for skill at index:", index);
        task.skills[index].rating = value;
        console.log(task.skills[index])
        // Perform any necessary actions with the selected rating
    }

    const handleSubmit = async () => {
        console.log(username, "user role", user_role);

        let filled = true;
        task.skills.map((skill) => {
            if(!skill.rating)
            {
                filled = false;
            }
        })

        if(filled == false)
        {
            alert("Please complete the evaluation!");
        }
        else
        {
            try
            {
                const evalu = await axios.post("http://localhost:8000/evaluate", {task_id: task_id, skills: task.skills});
                const upd = await axios.post("http://localhost:8000/updateStatus", {task_id: task_id, user_role: user_role, status: 'completed'});

                console.log(evalu.data);
                alert("Evaluation completed!")
                navigate("/employees");
                
            } catch (error) {
                alert("Could not evaluate form");
                console.log(error);
            }
            
        }

    }
    return (
        <div>
            <h1>Evaluate Task</h1>
            <h2>{task.title}</h2>
            <ul>
                {task.skills.map((skill, index) => (
                    <li style={{ color: "black" }} key={index}>
                        {skill.skill}
                        <label>Rating</label>
                        <select onChange={(event) => handleChange(event, index)}>
                            <option value="">Select rating</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit}>Evaluate</button>
        </div>
    )
}

export default EvaluateTask;