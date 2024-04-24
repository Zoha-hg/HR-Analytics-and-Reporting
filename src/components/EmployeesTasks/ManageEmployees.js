import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TaskView.css';


const ManageEmployees = () => {
    const [manager_id, setManagerId] = useState('');
    const [employee_id, setEmployeeId] = useState('');
    const [tasks, setTasks] = useState([]);
    const [user_role, setUserRole] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async (manager_id) => {
            let tasks_data = await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/getdepttasks", { manager_id });
            // console.log("employees", tasks_data.data);
            // if(tasks_data.error !== undefined) {
                setTasks(tasks_data.data);
                console.log(tasks_data.data);
                console.log("TASKS ", tasks);
            // }
            console.log("yoooo");
        }

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
        
        
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            try {
                // Make a GET request to the /user-role endpoint to extract the user's role based on the token
                const response = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/user-role', {
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

        const getEmployeeTasks = async (employee_id) => {
            let tasks_data = await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/getowntasks", { employee_id });
            console.log("employees", tasks_data.data);
            if(tasks_data.error === undefined) {
                setTasks(tasks_data.data);
                console.log("TASKS ", tasks_data.data);
            }
            console.log("yoooo");
        }
        const getData = async () => {
            let user = await fetchUserName();
            console.log("user", user);
            let userrole = await fetchUserRole();
            setUserRole(userrole);
            console.log("role ", user_role);
            if(userrole == "Manager")
            {
                fetchTasks(user);
            }
            else if(userrole == "Employee")
            {
                console.log("woah");
                getEmployeeTasks(user);
            }
        }

        getData();
    }, []);


    const handleStatusChange = async (event) => {
        const selectedIndex = event.target.dataset.index;
        const newCompletionStatus = event.target.value;

        try {
            const task_id = tasks[selectedIndex].task_id;
            await axios.post("https://hr-analytics-and-reporting-production.up.railway.app/updatestatus", { user_role: user_role, task_id: task_id, status: newCompletionStatus });

            // Update the tasks state with the new status
            setTasks(prevTasks => {
                const updatedTasks = [...prevTasks];
                updatedTasks[selectedIndex] = { ...updatedTasks[selectedIndex], completion_status: newCompletionStatus };
                return updatedTasks;
            });
        } catch (error) {
            alert("Couldn't update status");
        }
    }
    
    const formatDate = (date) => {
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const day = date.split('-')[2].split('T')[0]
        return day + "/" + month + "/" + year;
    }

    const selectClass = (status) => {
        if(status === 'completed')
        {
            return 'completed';
        }
        else if(status === 'in progress')
        {
            return 'inprogress';
        }
        else
        {
            return 'notstarted';
        }
    }

    const evalClass = (status) => {
        if(status === 'evaluate')
        {
            return 'Evaluate';
        }
        else if(status === 'pending')
        {
            return 'Pending';
        }
        else
        {
            return 'Completed';
        }
    }
    return(
        <div>

            { user_role === "Manager" && (
                <div className='Tasks'>
                    {tasks.length > 0 ? (
                        <div>

                            <h1>{tasks[0].department_name} Task Board</h1>
                            <Link to="/employees/createtask"><button className='addnew'>+ Add new</button></Link>
                            <table className="task_view">
                                <thead>
                                    <tr>
                                    <th>Title</th>
                                    <th>Assigned To</th>
                                    <th>Date Assigned</th>
                                    <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((taskObj, index) => (
                                    <tr key={index}>
                                        <td className='title'>{taskObj.title}</td>
                                        <td>{taskObj.assigned_to}</td>
                                        <td>{formatDate(taskObj.start_time)}</td>
                                        {taskObj.evaluation_status === 'evaluate' ? (
                                            <td><Link to={"/employees/evaluatetask/?task_id="+taskObj.task_id}><button className='evaluate'>Evaluate</button></Link></td>
                                        ) : (
                                            <td className='status_eval'><span className={evalClass(taskObj.evaluation_status)}>{evalClass(taskObj.evaluation_status)}</span></td>
                                        )}
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No tasks assigned</p>
                    )}
            </div>)}

            {
                user_role === "Employee" && (
                    <div className='Tasks'>
                        <h1>My Tasks</h1>
                            {tasks.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    <table className="task_view">
                                        <thead>
                                            <tr>
                                            <th>Title</th>
                                            <th>Date Assigned</th>
                                            <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map((taskObj, index) => (
                                            <tr key={index}>
                                                <td>{taskObj.title}</td>
                                                <td>{formatDate(taskObj.start_time)}</td>
                                                <td>
                                                    {
                                                        taskObj.completion_status === 'completed' ? (
                                                            <span className="completed">Completed</span>
                                                        ) : (
                                                            <select
                                                                value={taskObj.completion_status}
                                                                data-index={index}
                                                                onChange={handleStatusChange}
                                                                className={`${selectClass(taskObj.completion_status)} status`}
                                                            >
                                                                {/* <option className={taskObj.completion_status} value={taskObj.completion_status}>{taskObj.completion_status}</option> */}
                                                                <option className='notstarted' value="not started">Not started</option>
                                                                <option className='in progress' value="in progress">In progress</option>
                                                                <option id="completed" value="completed">Completed</option>
                                                            </select>
                                                        )
                                                    }
                                                </td>

                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </ul>
                            ) : (
                                <p>No tasks assigned</p>
                            )}
                    </div>
                )
            }
        </div>
    );
}

export default ManageEmployees;