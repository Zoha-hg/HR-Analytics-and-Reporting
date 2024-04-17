import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

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


    const handleChange = (event, index, newValue) => {
        console.log("Selected rating:", newValue, "for skill at index:", index);
        task.skills[index].rating = newValue;
        setTask({ ...task });
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
        <div className='Tasks'>
            <h1>Evaluate Task: </h1>
            <h2>{task.title}</h2>
            <div className='line'></div>
            <div className='skill-eval'>
                <ul className='skills'>
                    {task.skills.map((skill, index) => (
                        <li style={{ color: "black" }} key={index}>
                            <span>{skill.skill}</span>
                            <StyledRating
                                name={`skill-rating-${index}`}
                                value={skill.rating || 0}
                                onChange={(event, newValue) => handleChange(event, index, newValue)}
                                IconContainerComponent={IconContainer}
                                getLabelText={(value) => customIcons[value].label}
                                highlightSelectedOnly
                            />
                        </li>
                    ))}
                </ul>

            </div>
            <button className="submit" onClick={handleSubmit}>Evaluate</button>
        </div>
    )
}

export default EvaluateTask;