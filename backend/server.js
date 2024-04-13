const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require("./models/users.model");
const feedbackModel = require("./models/feedback_model");
const hrModel = require("./models/hr_model");
const departmentModel = require("./models/department_model");
const employeeModel = require("./models/employee_model");
const managerModel = require("./models/manager_model");
const taskModel = require("./models/tasks_model");
const dailyTrackingModel = require("./models/daily_tracking_model");
const authorize = require("./email-api/services/googleApiAuthService");
const TimeLog = require("./models/timeLog_model");
const {authorize2,loadSavedCredentialsIfExists} = require("./email-api/services/googleApiAuthService2");
const { listSentMessages, listMessages, sendEmail, listJunkMessages, listTrashMessages } = require("./email-api/services/gmailApiServices");



require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true});
const User = mongoose.model("User", userModel);
const Feedback = mongoose.model("Feedback", feedbackModel);
const Employee = mongoose.model("Employee", employeeModel);
const Manager = mongoose.model("Manager", managerModel);
const Task = mongoose.model("Task", taskModel);
const DailyTracking = mongoose.model("DailyTracking", dailyTrackingModel);
const Department = mongoose.model("Department", departmentModel);
const HR = mongoose.model("HR", hrModel);


const connection = mongoose.connection;

connection.once("open", () => 
{
  console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint to get user role
app.get('/user-role', authenticateToken, async (req, res) => {
  // console.log('User:', req)
  try {
    // console.log('Fetching user role for:', req.user.username)
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).send('User not found');
    // console.log(user)
    res.json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Failed to fetch user role' });
  }
});

// API Endpoint to get username.
app.get('/user-name', authenticateToken, async (req, res) => {
  // console.log('User:', req)
  try {
    // console.log('Fetching user role for:', req.user.username)
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).send('User not found');
    // console.log(user)
    res.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Failed to fetch user role' });
  }
});


app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });

  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Failed to sign up. Please try again.' });
  }
});


app.post("/login", async (req, res) => 
{
  try 
  {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) 
    {
      
      const token = jwt.sign({ username: user.username, role: user.role }, process.env.TOKEN_SECRET);

      res.status(200).json({ token });
    } 
    else 
    {
      res.status(401).json("Invalid credentials");
    }
  } 
  catch (error) 
  {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to log in. Please try again.' });
  }
});

app.get('/verify-token', authenticateToken, (req, res) => {
  // Assuming req.user is set by authenticateToken middleware
  res.status(200).json({ username: req.user.username });
});



app.listen(8000, () => 
{
  console.log("Server started on port 8000");
});

app.post('/createform', async (req, res) => {
  try {
      const {filled, title, description, start_time, end_time, questions } = req.body;

      let form_id = 0;
    const lastFeedback = await Feedback.find().sort({ form_id: -1 }).limit(1);
    
    let last_form_id = 0;
    if (lastFeedback.length !== 0) {
      last_form_id = lastFeedback[0].form_id;
    }
    form_id = last_form_id + 1;
    console.log("form_id is " + form_id);
      const newForm = await Feedback.create({
          form_id,
          filled,
          title,
          description,
          start_time,
          end_time,
          questions
      });

	  await Employee.updateMany({}, { $push: { feedback_forms: newForm._id } }); // check this line.
	  await Manager.updateMany({}, { $push: { feedback_forms: newForm._id } }); // check this line.
    res.status(201).json(newForm);
  } catch (error) {
      console.error('Error creating form:', error);
      res.status(500).json({ message: 'Failed to create form. Please try again.' });
  }
});


app.get('/fillform', async (req, res) => {
  try {
      const { form_id, employee_id, answers } = req.body;
      const newFilledForm = await DailyTracking.create({
          form_id,
          employee_id,
          answers
      });
      res.status(201).json(newFilledForm);
  } catch (error) {
      console.error('Error filling form:', error);
      res.status(500).json({ message: 'Failed to fill form. Please try again.' });
  }
});


app.get('/displayform', async (req, res) => {
	try {
		const forms = await Feedback.find({});
		res.status(200).json(forms);
	} catch (error) {
		console.error('Error fetching forms:', error);
		res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
	}
  });

// just so i can make employees pls ignore

const getDepartment = async (ddepartment_id) => {
	try {
		const departments = await Department.findOne({department_id: ddepartment_id});
		return departments
	} catch (error) {
		console.error('Error fetching departments:', error);
	}
  }
app.post('/createemployee', async (req, res) => {
	try {
		const {
			employee_name,
			dept,
			gender,
			position,
			salary,
			age,
			address,
			phone_number,
		} = req.body;
		let employee_id = 0;
		const lastEmployee = await Employee.find().sort({ employee_id: -1 }).limit(1);

		let last_employee_id = 0;
		if (lastEmployee.length !== 0)
		{
			last_employee_id = lastEmployee[0].employee_id;
		}
		employee_id = last_employee_id + 1;
		console.log("employee_id is " + employee_id);
		
		const department = await getDepartment(dept);
		// Create the employee
		const newEmployee = new Employee({
			employee_id,
			employee_name,
			department,
			gender,
			position,
			salary,
			age,
			address,
			phone_number
		});

		// Save the employee to the database
		await newEmployee.save();

		res.status(201).json({ message: 'Employee created successfully.', employee: newEmployee });
	} catch (error) {
		console.error('Error creating employee:', error);
		res.status(500).json({ message: 'Failed to create employee. Please try again.' });
	}
  });

app.post('/createdepartment', async (req, res) => {
	  try {
	  const { department_name} = req.body;
	  let department_id = 0;
	  const lastDepartment = await Department.find().sort({ department_id: -1 }).limit(1);
	  
	  let last_department_id = 0;
	  if (lastDepartment.length !== 0) {
		last_department_id = lastDepartment[0].department_id;
	  }
	  department_id = last_department_id + 1;
	  console.log("department_id is " + department_id);
	  const newDepartment = await Department.create({
		  department_id,
		  department_name
	  });
	  res.status(201).json(newDepartment);
  } catch (error) {
	  console.error('Error creating department:', error);
	  res.status(500).json({ message: 'Failed to create department. Please try again.' });
  }
});


app.get('/start-gmail-authorization', authenticateToken ,async (req, res) => {
  console.log("here")
  try {
    // Using the username from the authenticated user's details
    console.log('User:', req.user);
    const username = req.user.username;

    if (!username) {
      return res.status(400).send('User identifier is missing');
    }

    // Call your authorization logic here with the username
    await authorize2(username);
    res.status(200).send('Authorization initiated');
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).send('Internal server error');
  }

});





const getClient = async (req, res, next) => {
  
  const username = req.user.username;
  console.log("heyy", username)

  if (!username) {
      return res.status(401).send('Username is missing from the request');
  }

  try {
      // Load the saved credentials (e.g., refresh token) for the user
      const authClient = await loadSavedCredentialsIfExists(username);

      if (!authClient) {
   
          return res.status(401).send('Failed to load authentication credentials for the user');
      }

      // Attach the authenticated Google client to the request object so it can be used in subsequent route handlers
      req.authClient = authClient;

      next(); // Proceed to the next middleware/route handler
  } catch (error) {
      console.error('Error in getClient middleware:', error);
      res.status(500).send('Internal server error while loading Google client');
  }
};

// Gmail routes


app.get('/api/gmail/inbox', authenticateToken, async (req, res) => {
    const username = req.user.username;  // Assuming this is set by authenticateToken
  
    const authClient = await authorize2(username);
  
    const messages = await listMessages(authClient);
    res.json(messages);
});

app.get('/api/gmail/sent', authenticateToken, async (req, res) => {
  const username = req.user.username;  // Assuming this is set by authenticateToken

  const authClient = await authorize2(username);

  const messages = await listSentMessages(authClient);
  res.json(messages);
});



app.get('/api/gmail/junk', authenticateToken, async (req, res) => {
  const username = req.user.username;  // Assuming this is set by authenticateToken

  const authClient = await authorize2(username);

  const messages = await listJunkMessages(authClient);
  res.json(messages);
});

app.get('/api/gmail/deleted', authenticateToken, async (req, res) => {
  const username = req.user.username;  // Assuming this is set by authenticateToken

  const authClient = await authorize2(username);

  const messages = await listTrashMessages(authClient);
  res.json(messages);
});

app.post('/api/gmail/send', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const username = req.user.username;

  try {
      const authClient = await authorize2(username);
      const result = await sendEmail(authClient, message); // Assuming sendEmail expects a single message string
      res.json(result);
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email' });
  }
});

const authenticateToken1 = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    try {
      // Assuming the JWT token was created with the username
      const user = await User.findOne({ username: decoded.username });
      if (!user) {
        return res.sendStatus(404); // User not found
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Error fetching user from token:', error);
      res.status(500).json({ message: 'Failed to authenticate token.' });
    }
  });
};


app.post('/start-time-log', authenticateToken1, async (req, res) => {
  try {
    const newTimeLog = new TimeLog({
      user: req.user._id,  // Use the full user object's _id
      startTime: new Date(),
    });

    await newTimeLog.save();
    res.status(201).json(newTimeLog);
  } catch (error) {
    console.error('Error starting time log:', error);
    res.status(500).json({ message: 'Failed to start time log. Please try again.' });
  }
});


app.post('/stop-time-log', authenticateToken1, async (req, res) => {
  try {
    const { timeLogId } = req.body;
    const timeLog = await TimeLog.findById(timeLogId);

    if (!timeLog) {
      return res.status(404).send('Time log not found');
    }

    if (timeLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized to modify this time log');
    }

    timeLog.endTime = new Date();
    timeLog.duration = (timeLog.endTime - timeLog.startTime) / 1000; // Duration in seconds
    console.log("timeLog", timeLog)
    await timeLog.save();

    res.status(200).json(timeLog);
  } catch (error) {
    console.error('Error stopping time log:', error);
    res.status(500).json({ message: 'Failed to stop time log. Please try again.' });
  }
});
app.get('/total-time/:date', authenticateToken1, async (req, res) => {
  try {
    const dateString = req.params.date; // 'YYYY-MM-DD' format assumed
    const userTimezoneOffset = req.user.timezoneOffset || 0; // Assuming timezone offset in minutes might be stored in user profile

    const date = new Date(dateString);
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    startOfDay.setMinutes(startOfDay.getMinutes() + userTimezoneOffset);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const timeLogs = await TimeLog.find({
      user: req.user,
      startTime: { $gte: startOfDay },
      endTime: { $lte: endOfDay }
    });
    
    const totalDuration = timeLogs.reduce((total, log) => {
      return total + (log.duration || 0);
    }, 0);

    res.json({
      date: dateString,
      totalDurationInSeconds: totalDuration,
      totalDurationFormatted: formatDuration(totalDuration),
    });
  } catch (error) {
    console.error('Error calculating total time:', error);
    res.status(500).json({ message: 'Failed to calculate total time. Please try again.' });
  }
});
// app.get('/total-time-graph', authenticateToken1, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of today
//     const endOfDay = new Date(today);
//     endOfDay.setHours(23, 59, 59, 999); // Set to end of today

//     const timeLogs = await TimeLog.find({
//       user: req.user._id,
//       startTime: { $gte: today },
//       endTime: { $lte: endOfDay }
//     });

//     const timeEntries = timeLogs.map(log => ({
//       date: log.startTime.toISOString().split('T')[0],
//       duration: log.duration,
//     }));

//     const totalDuration = timeLogs.reduce((total, log) => total + (log.duration || 0), 0);

//     res.json({
//       date: today.toISOString().split('T')[0],
//       totalDurationInSeconds: totalDuration,
//       totalDurationFormatted: formatDuration(totalDuration),
//       timeEntries,
//     });
//   } catch (error) {
//     console.error('Error calculating total time:', error);
//     res.status(500).json({ message: 'Failed to calculate total time. Please try again.' });
//   }
// });
app.get('/total-time-graph', authenticateToken1, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Set to end of today

    const timeLogs = await TimeLog.find({
      user: req.user._id,
      startTime: { $gte: today },
      endTime: { $lte: endOfDay }
    });

    // Here, you map timeLogs to create an array of time entries with hourly labels.
    const timeEntries = timeLogs.map(log => ({
      // Assuming startTime is stored as a Date object in your database.
      // Extract the hours and minutes as labels.
      label: `${log.startTime.getHours().toString().padStart(2, '0')}:${log.startTime.getMinutes().toString().padStart(2, '0')}`,
      duration: log.duration,
    }));

    const totalDuration = timeLogs.reduce((total, log) => total + (log.duration || 0), 0);

    // Now, instead of sending back the date, you send back an array of the generated labels and durations.
    res.json({
      labels: timeEntries.map(entry => entry.label), // This will be the x-axis labels (hours)
      durations: timeEntries.map(entry => entry.duration), // This will be the y-axis data (durations)
      totalDurationInSeconds: totalDuration,
      totalDurationFormatted: formatDuration(totalDuration),
    });
  } catch (error) {
    console.error('Error calculating total time:', error);
    res.status(500).json({ message: 'Failed to calculate total time. Please try again.' });
  }
});

app.get('/total-time-weekly/:date', authenticateToken1, async (req, res) => {
  try {
      const inputDate = new Date(req.params.date);  // Assumes 'YYYY-MM-DD' format
      const weekStart = new Date(inputDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to Sunday (start of week)
      weekStart.setUTCHours(0, 0, 0, 0);  // Start of the day in UTC

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);  // Move to Saturday (end of week)
      weekEnd.setUTCHours(23, 59, 59, 999);  // End of the day in UTC

      const timeLogs = await TimeLog.find({
          user: req.user,
          startTime: { $gte: weekStart },
          endTime: { $lte: weekEnd }
      });
      
      const totalDuration = timeLogs.reduce((total, log) => total + (log.duration || 0), 0);

      res.json({
        weekStarting: weekStart.toISOString().split('T')[0],
        weekEnding: weekEnd.toISOString().split('T')[0],
        totalDurationInSeconds: totalDuration,
        totalDurationFormatted: formatDuration(totalDuration),
      });
  } catch (error) {
      console.error('Error calculating weekly total time:', error);
      res.status(500).json({ message: 'Failed to calculate weekly total time. Please try again.' });
  }
});

app.get('/total-time-monthly/:date', authenticateToken1, async (req, res) => {
  try {
    const inputDate = new Date(req.params.date); // Assumes 'YYYY-MM-DD' format
    const monthStart = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), 1)); // Set to the first day of the month
    const monthEnd = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth() + 1, 0, 23, 59, 59, 999)); // Set to the last day of the month

    // Query to find time logs within the start and end of the month
    const timeLogs = await TimeLog.find({
      user: req.user._id, // Assuming req.user._id contains the ID of the authenticated user
      startTime: { $gte: monthStart },
      endTime: { $lte: monthEnd }
    });

    

    // Reducing timeLogs to calculate totalDuration
    const totalDuration = timeLogs.reduce((total, log) => total + (log.duration || 0), 0);

    // Sending the response
    res.json({
      monthStarting: monthStart.toISOString().split('T')[0],
      monthEnding: monthEnd.toISOString().split('T')[0],
      totalDurationInSeconds: totalDuration,
      totalDurationFormatted: formatDuration(totalDuration),
    });

  } catch (error) {
    console.error('Error calculating monthly total time:', error);
    res.status(500).json({ message: 'Failed to calculate monthly total time. Please try again.' });
  }
});



function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}
