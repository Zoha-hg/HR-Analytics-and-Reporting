import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import "./CreateNewTask.css";
const CreateNewTask = () => {
    const [manager_id, setManagerId] = useState('');
    // const [employee_id, setEmployeeId] = useState('');
    const [employees, setEmployees] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        assignedTo: '',
        start_time: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserName = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/user-name', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setManagerId(response.data.username);
                return response.data.username;
                
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        
        const getEmployees = async (employee_id) =>
        {
            const employeess = await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/getdeptemplyees", {manager_id: employee_id});

            console.log("employees: ", employeess);
            setEmployees(employeess.data);
        }

        const getData = async () => {
            let username = await fetchUserName();
            await getEmployees(username);
        }
        getData();
    }, []);
    
    const handleAssignEmployee = (employee_id) => {
        console.log("EMPLOYEE", employee_id.target.value)
        setNewTask(prevState => ({
            ...prevState,
            assignedTo: employee_id.target.value // Assign the employee name here
        }));
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSkillChange = (event) => {
        setNewSkill(event.target.value);
    };

    const addSkill = () => {
        if (newSkill.trim() !== '') {
            setNewTask(prevState => ({
                ...prevState,
                skills: [...prevState.skills, newSkill]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        setNewTask(prevState => ({
            ...prevState,
            skills: prevState.skills.filter((_, i) => i !== index)
        }));
    };

    const newTaskSubmit = async () =>
    {
        const incomplete = Object.values(newTask).some(value => value === '');

        if (incomplete)
        {
            alert('One or more fields in newTask are undefined');
            console.log(newTask)
        }
        else
        {
            let task = {
                title: newTask.title,
                manager_id: manager_id,
                employee_id: newTask.assignedTo,
                start_time: newTask.start_time,
                skills: newTask.skills
            }
            alert('All fields in newTask are defined');
            console.log("Task: ", task);
            try
            {
                const response = await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/createtask", task);
                console.log(response);
                navigate("/employees")
            } catch (error)
            {
                alert("ERROR" + error)
            }
        }
    }
    return(
        <div className='Tasks task-create'>

            <h1>Create Task</h1>
            
            <label htmlFor="title">Title:</label>
            <input
                type='text'
                name='title'
                value={newTask.title}
                onChange={handleInputChange}
            />
            <label htmlFor="start_time">Start time:</label>
            <input
                type='datetime-local'
                name='start_time'
                value={newTask.start_time}
                onChange={handleInputChange}
            />
            <label htmlFor="assignedTo">Assigned to:</label>
            <select
                name='assignedTo'
                value={newTask.assignedTo}
                onChange={handleAssignEmployee}
            >
                <option value="">Select an employee</option>
                {employees.map(employee => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.employee_name} ({employee.position})
                    </option>
                ))}
            </select>
            <label htmlFor="skill">Skill:</label>
            <ul className='skills'>
                {newTask.skills.map((skill, index) => (
                    <li style={{color: "black"}} key={index}>
                        <p>{skill}</p>
                        <button onClick={() => removeSkill(index)}>Remove</button>
                    </li>
                ))}
            </ul>
            <div className='addskill'>
                <input
                    type='text'
                    name='skill'
                    value={newSkill}
                    onChange={handleSkillChange}
                />
                <button onClick={addSkill}>Add Skill</button>

            </div>
            <button className="submit" onClick={newTaskSubmit}>Add Task</button>
        </div>
    )
}

export default CreateNewTask;