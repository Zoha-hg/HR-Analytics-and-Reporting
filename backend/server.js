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
const { listSentMessages, listMessages, sendEmail, listJunkMessages, listTrashMessages, listUnreadMessages, countUnreadMessages } = require("./email-api/services/gmailApiServices");



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
const { default: axios } = require("axios");
const { all } = require("axios");
const e = require("express");
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
	try
	{
		// console.log('Fetching user role for:', req.user.username)
		const user = await User.findOne({ username: req.user.username });
		if (!user) return res.status(404).send('User not found');
		// console.log(user)
		res.json({ username: user.username });
	}
	catch (error) {
		console.error('Error fetching user role:', error);
		res.status(500).json({ message: 'Failed to fetch user role' });
	}
});


app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
	// Ensuring that all of the fields are filled
	if (!username || !email || !password || !role) {
	  return res.status(400).json({ message: 'All fields are required' });
	}
	// Checking if the email is valid
	const validEmail = await verifyEmail(email);
	if (validEmail){
		const hashedPassword = await bcrypt.hash(password, 10);
		if (role == "Employee"){
			// Checking if the user already exists in the employee database:
			const existingEmployee = await Employee.findOne({ employee_id: username });
			if (!existingEmployee) {
				return res.status(401).json({ message: 'Employee does not exist' });
		}}
		if (role == "Manager"){
			// Checking if the user already exists in the manager database:
			const existingManager = await Manager.findOne({ employee_id: username });
			if (!existingManager) {
				return res.status(401).json({ message: 'Manager does not exist' });
		}}
		// Checking if the email or username already exist in the database.
		const existing = await User.findOne({ $or: [{ username }, { email }] });
		if (existing) {
		return res.status(401).json({ message: 'User already exists' });
		}
		else{
		// Checking if the password is valid and contains at least 8 characters with 1 digit, 1 uppercase letter, 1 lowercase letter, and 1 special character.
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
		if (!password.match(passwordRegex)) {
			// console.log('Password invalid:', password)
			return res.status(400).json({ message: 'Password must contain at least 8 characters with 1 digit, 1 uppercase letter, 1 lowercase letter, and 1 special character.' });
		}
		else {
			const newUser = new User({ username, email, password: hashedPassword, role });
			await newUser.save();
			// Adding the user's credentials to the relevant database
			await addUser(username, email, role);
			res.status(201).json({ message: "Signup successful" });
		}
		}
	}
	else{
		return res.status(400).json({ message: 'Could not verify Email. Please try with a different Email.' });
	}
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Failed to sign up. Please try again.' });
  }
});

const verifyEmail = async (email) => {
	// Checking if the email is valid by using the hunter API

	const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTER_API_KEY}`;

	try{
		const response = await axios.get(url);
		if (response.data.data.status === 'valid'){
			return true;
		}
		else{
			return false;
		}

	} catch(error){
		console.log("Error message:", error.message);
		console.log("Error details:", error.response ? error.response.data : "No response data");

		return false;
	};
}

const addUser = async (username, email, role) => {
	//Adding the details of the user to the rest of the database
}

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

		//get last filled form id and increment it by 1
		const {filled, title, description, start_time, end_time, questions } = req.body;

		const form_id = parseInt(new mongoose.Types.ObjectId().toString().substring(0, 8), 16);
	
		// make a new form
		const newForm = await Feedback.create({
			form_id,
			filled,
			title,
			description,
			start_time,
			end_time,
			questions
		});

		// push the new form to all employees and managers
		await Employee.updateMany({}, { $push: {feedback_forms: { form: newForm, filled: false }} });
		await Manager.updateMany({}, { $push: {feedback_forms: { form: newForm, filled: false }} });

		res.status(201).json(newForm);
	}
	catch (error)
	{
		console.error('Error creating form:', error);
		res.status(500).json({ message: 'Failed to create form. Please try again.' });
	}

});


app.post('/displayforms', async (req, res) => {
    try
	{
		const {user, user_role} = req.body;
		// const user_role = getUserRole(user);
		console.log("user role", user_role, "hehehe", req.body)
		if(user_role === "Employee")
		{
			const employee = await Employee.findOne({ employee_id: user }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback',
			});
			console.log("got the employee !", employee)
			if (!employee) // if employee doesnt exist
			{
				console.log(user)
				return res.status(404).json({ message: 'Employee not found.' });
			}
	
			const formsWithData = employee.feedback_forms.map(formObj => formObj); // get all forms with data
	
			const forms = formsWithData.map(form => ({ // map the forms to only the required fields
				form_id: form.form.form_id,
				title: form.form.title,
				description: form.form.description,
				start_time: form.form.start_time,
				end_time: form.form.end_time,
				filled: form.filled
			}));
			// console.log("forms", forms.filter(form => new Date(form.end_time) > new Date()))
			res.status(200).json(forms); // filter out forms that have ended and send
		}
		else if(user_role === "Manager")
		{
			const manager = await Manager.findOne({ employee_id: user }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback', // Assuming your model name for feedback is 'Feedback'
			});
	
			// console.log("got the employee !", user)
			if (!manager) // if employee doesnt exist
			{
				console.log(user)
				return res.status(404).json({ message: 'Employee not found.' });
			}
			// console.log("FORM ", employee.feedback_forms[0].form);
	
			const formsWithData = manager.feedback_forms.map(formObj => formObj);
	
			// console.log("Feedback Forms with Data: ", formsWithData);
			const forms = formsWithData.map(form => ({
				form_id: form.form.form_id,
				title: form.form.title,
				description: form.form.description,
				start_time: form.form.start_time,
				end_time: form.form.end_time,
				filled: form.filled
			}));
	
			// console.log("forms", forms)
			res.status(200).json(forms); // filter out forms that have ended and send
		}
		else
		{
			const forms = await Feedback.find({}).sort({ form_id: -1 });
			res.status(200).json(forms);
		
		}
    }
	catch (error)
	{
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
    }
});

app.post("/fillform", async (req, res) => {
	try
	{
		const { form_id, employee_id, user_role, answers } = req.body;

		if(user_role === "Employee")
		{
			console.log("employee_id ", employee_id, form_id);
			const employee = await Employee.findOne({ employee_id : employee_id }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback', 
			});
			console.log("employee ", employee.feedback_forms[0].form.form_id);
			if(employee.feedback_forms[0].form.form_id == form_id)
			{
				console.log("EQUAL")
			}
			const formIndex = employee.feedback_forms.findIndex(formObj => formObj.form.form_id == form_id);
			console.log("formIndex ", formIndex)
			const form = employee.feedback_forms[formIndex].form;
			
			console.log("before update ", employee.feedback_forms[formIndex].form);
	
			employee.feedback_forms[formIndex].ratingList = answers;
			employee.feedback_forms[formIndex].filled = true;
	
			console.log("new employee should hav form ", employee.feedback_forms[formIndex]);
			await employee.save();
	
			const updatedEmployee = await Employee.findOne({ employee_id }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback',
			});
		}
		else if(user_role === "Manager")
		{
			const manager = await Manager.findOne({ employee_id : employee_id }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback', 
			});
			console.log("formIndex ", manager.feedback_forms)
			const formIndex = manager.feedback_forms.findIndex(formObj => formObj.form.form_id == form_id);
			const form = manager.feedback_forms[formIndex].form;
			
			console.log("before update ", manager.feedback_forms[formIndex].form);
	
			manager.feedback_forms[formIndex].ratingList = answers;
			manager.feedback_forms[formIndex].filled = true;
	
			console.log("new employee should hav form ", manager.feedback_forms[formIndex]);
			await manager.save();
	
			const updatedManager = await Manager.findOne({ employee_id }).populate({
				path: 'feedback_forms.form',
				model: 'Feedback',
			});
		}
		// console.log("Updated employee:", updatedEmployee.feedback_forms[1].form.questions[0]);
		res.status(201).json("Form filled successfully");
	}
	catch (error) {
		console.error('Error filling form:', error);
		res.status(500).json({ message: 'Failed to fill form. Please try again.' });
	}
});

app.post("/displayresults", async (req, res) => {
	try
	{
		const { form_id } = req.body;
		console.log("form_id ", form_id)
		const form = await Feedback.findOne({ form_id: form_id });
		const allEmployees = await Employee.find({}).populate({
			path: 'feedback_forms.form',
            model: 'Feedback', // Assuming your model name for feedback is 'Feedback'
        });
		const allManagers = await Manager.find({}).populate({
			path: 'feedback_forms.form',
			model: 'Feedback', // Assuming your model name for feedback is 'Feedback'
		});
		// console.log("Form ", form)
		let total_ratings = [];
		for(let j = 0; j < form.questions.length; j++)
		{
			total_ratings.push({question: "", rating1: 0, rating2: 0, rating3: 0, rating4: 0, rating5: 0, total_rating: 0});
		}
		// console.log(allEmployees.length, allManagers.length);
		for(let i = 0; i < allEmployees.length; i++)
		{
			const employee = allEmployees[i];
			// console.log("employee ", employee.feedback_forms)
			const formIndex = employee.feedback_forms.findIndex(formObj => formObj.form.form_id == form_id);
			// console.log("formIndex ", formIndex)
			if(formIndex === -1)
			{
				continue;
			}
			else
			{
				const forms = employee.feedback_forms[formIndex].form;
				const form_ratings = employee.feedback_forms[formIndex].ratingList;
				// console.log("Form rating ", form_ratings);
				for(let j = 0; j < forms.questions.length; j++)
				{
					const question = forms.questions[j];
				
					total_ratings[j].question = question.question;
					// console.log("questions ", total_ratings[j].question)
					if(form_ratings[j] === 1)
					{
						total_ratings[j].rating1 += 1;
					}
					else if(form_ratings[j] === 2)
					{
						total_ratings[j].rating2 += 1;
					}
					else if(form_ratings[j] === 3)
					{
						total_ratings[j].rating3 += 1;
					}
					else if(form_ratings[j] === 4)
					{
						total_ratings[j].rating4 += 1;
					}
					else if(form_ratings[j] === 5)
					{
						total_ratings[j].rating5 += 1;
					}
					// console.log("total_ratings[j].total_rating ", total_ratings[j].total_rating, form_ratings[j], i)
					total_ratings[j].total_rating += form_ratings[j];
					// console.log("total_ratings[j].total_rating ", total_ratings[j].total_rating, form_ratings[j], i)
					// console.log("total_ratings[j].total_rating ", total_ratings[j].total_rating)

				}
			}
		}

		for(let i = 0; i < allManagers.length; i++)
		{
			const managers = allManagers[i];
			const formIndex = managers.feedback_forms.findIndex(formObj => formObj.form.form_id === form_id);

			if(formIndex === -1)
			{
				continue;
			}
			else 
			{
				const forms = managers.feedback_forms[formIndex].form;
				const form_ratings = managers.feedback_forms[formIndex].ratingList;
				for(let j = 0; j < forms.questions.length; j++)
				{
					const question = forms.questions[j];
				
					total_ratings[j].question = question.question;
					if(form_ratings[j] === 1)
					{
						total_ratings[j].rating1 += 1;
					}
					else if(form_ratings[j] === 2)
					{
						total_ratings[j].rating2 += 1;
					}
					else if(form_ratings[j] === 3)
					{
						total_ratings[j].rating3 += 1;
					}
					else if(form_ratings[j] === 4)
					{
						total_ratings[j].rating4 += 1;
					}
					else if(form_ratings[j] === 5)
					{
						total_ratings[j].rating5 += 1;
					}
					total_ratings[j].total_rating = form_ratings[j];
				}
			}
		}
		console.log("total_ratings ", total_ratings)
		res.send(total_ratings);
	}
	catch (error)
	{
		console.error('Error fetching forms:', error);
		res.status(500).json({ message: 'Failed to fetch forms. Please try again.' });
	}
});

app.post("/getform", async (req, res) =>
{
	const {form_id} = req.body;

	const form = await Feedback.findOne({form_id: form_id});
	if(!form)
	{
		res.send("error");
	}
	const formData =
	{
		title: form.title,
		description: form.description,
		questions: form.questions
	}
	console.log("FORM DATA ", formData);
	res.send(formData);
})

app.post("/getfillform", async (req, res) =>
{
	const {form_id} = req.body;

	const form = await Feedback.findOne({form_id: form_id});
	if(!form)
	{
		res.send("error");
	}
	const formData =
	{
		title: form.title,
		description: form.description,
		questions: form.questions
	}
	console.log("FORM DATA ", formData);
	res.send(formData);
})

app.post("/createtask", async (req, res) => {
	const {manager_id, employee_id, title, start_time, skills} = req.body;

	const task_id = parseInt(new mongoose.Types.ObjectId().toString().substring(0, 8), 16);

	//create a new task
	const assigned_by = await Manager.findOne({employee_id: manager_id});
	const assigned_to = await Employee.findOne({employee_id: employee_id});
	if(assigned_by === null ||assigned_to === null)
	{
		res.status(404).json({ error: 'Manager or Employee not found' });
	}

	let ski = [];

	skills.map((skill) => {
		let s = {
			skill: skill,
			rating: undefined
		}
		ski.push(s);	
	})
	console.log("ski", ski)
	let task = {
		task_id,
		title,
		start_time,
		assigned_by,
		assigned_to,
		skills: ski
	};
	try
	{
		const newTask = await Task.create(task);
		await Manager.updateOne({ employee_id: manager_id }, { $push: { tasks: newTask } });
		await Employee.updateOne({employee_id: employee_id},{ $push: { tasks: newTask }});
		res.status(201).json({ message: 'Task created successfully.', task: newTask });
		// Handle successful creation
	}
	catch (error) {
		res.status(500).json(error);
	}

});

app.post("/getdepttasks", async (req, res) => {
	const {manager_id} = req.body;

	try
	{

		const manager = await Manager.findOne({ employee_id: manager_id }).populate({
			path: 'tasks', // Correct the model field name to 'tasks'
			populate: {
				path: 'assigned_to', // Populate the 'assigned_to' field
				model: 'Employee', // Use the correct model name 'Employee'
				select: 'employee_name' // Select the 'name' field of the employee
			}
		}).populate('department', 'department_name');
		
		console.log("manager", manager);
		if (!manager) // if employee doesnt exist
		{
			console.log("um who is this manager:" , manager)
			return res.status(404).json({ message: 'Manager not found.' });
		}
	
		const tasks = manager.tasks.map(task => task); // get all forms with data
	
		const alltasks = tasks.map(task => ({ // map the forms to only the required fields
			task_id: task.task_id,
			title: task.title,
			start_time: task.start_time,
			end_time: task.end_time,
			assigned_to: task.assigned_to.employee_name,
			department_name: manager.department.department_name, 
			evaluation_status: task.evaluation_status
		}));
		// console.log("forms", forms.filter(form => new Date(form.end_time) > new Date()))
		res.status(200).json(alltasks);
	}catch (error) {
		console.log("error", error)
		res.status(500).json({ error: 'Failed to fetch tasks. Please try again.' });
	}

});

app.post("/getdeptemplyees", async (req, res) => {
	const {manager_id} = req.body;
	console.log("manager", manager_id);
	const manager = await Manager.findOne({ employee_id: manager_id }).populate({
		path: 'department',
		model: 'Department',
	})

	// res.send("wow");
	if (!manager) // if employee doesnt exist
	{
		return res.status(404).json({ message: 'Manager not found.' });
	}
	const employees = await Employee.find({ department: manager.department });


	console.log("Employees! ", employees);
	res.status(200).json(employees);

});


app.post("/updateStatus", async (req, res) =>
{
	const {task_id, user_role, status} = req.body;

	try
	{

		if(user_role === "Manager")
		{
			await Task.updateOne({ task_id: task_id }, { evaluation_status: status });
	
		}
		else
		{
			await Task.updateOne({ task_id: task_id }, { completion_status: status });
			if(status ==="completed")
			{

				await Task.updateOne({ task_id: task_id }, { evaluation_status: "evaluate" });
			}
	
		}
		res.send("Done!");
	}catch (error)
	{
		res.send({error: error})
	}
	
})

app.post("/gettask", async (req, res) => {

	const {task_id} = req.body;

	const task = await Task.find({task_id: task_id});

	console.log(task[0]);
	res.send(task[0]);
})

app.post("/evaluate", async (req, res) => {
	const {task_id, skills} = req.body

	try
	{

		await Task.updateOne({ task_id: task_id }, { skills: skills });
		console.log("DONE");
		res.send("done");
	} catch (error) {
		res.send(error);
	}
})

app.post("/getowntasks", async (req, res) => {
	const {employee_id} = req.body;

	try
	{
		const employee = await Employee.findOne({ employee_id: employee_id }).populate({
			path: 'tasks',
		})
		
		console.log("employee", employee.tasks);
		res.send(employee.tasks)

	} catch (error) {
		console.log("eror", error);
		res.send({error: error})
	}

})


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

app.post("/createmanager", async (req, res) => {
	const {employee_name, department, gender, age, address, phone_number} = req.body;

	const dept = await getDepartment(department);
	console.log("dept ", dept);
	const manager_id = 5;

	const newManager = new Manager({
		employee_id: manager_id,
		employee_name,
		department: dept,
		age,
		gender,
		address,
		phone_number
	});

	await newManager.save();

	res.status(201).json(newManager);

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





// const getClient = async (req, res, next) => {
  
//   const username = req.user.username;
//   console.log("heyy", username)

//   if (!username) {
//       return res.status(401).send('Username is missing from the request');
//   }

//   try {
//       // Load the saved credentials (e.g., refresh token) for the user
//       const authClient = await loadSavedCredentialsIfExists(username);

//       if (!authClient) {
   
//           return res.status(401).send('Failed to load authentication credentials for the user');
//       }

//       // Attach the authenticated Google client to the request object so it can be used in subsequent route handlers
//       req.authClient = authClient;

//       next(); // Proceed to the next middleware/route handler
//   } catch (error) {
//       console.error('Error in getClient middleware:', error);
//       res.status(500).send('Internal server error while loading Google client');
//   }
// };

// Gmail routes


app.get('/api/gmail/inbox', authenticateToken, async (req, res) => {
    const username = req.user.username;  // Assuming this is set by authenticateToken
  
    const authClient = await authorize2(username);
  
    const messages = await listMessages(authClient);
    res.json(messages);
});
app.get('/api/gmail/unread', authenticateToken, async (req, res) => {
  const username = req.user.username;  // Assuming this is set by authenticateToken

  const authClient = await authorize2(username);

  const messages = await listUnreadMessages(authClient);
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
    }).sort({ startTime: 1 }); // Make sure to sort by startTime

    // Assuming you want to group durations by hour, you may need a more complex aggregation.
    // Below is a simple map for demonstration.
    const hourlyDurations = new Array(24).fill(0); // Array to hold sums of durations for each hour
    timeLogs.forEach(log => {
      const hour = log.startTime.getHours();
      hourlyDurations[hour] += log.duration; // Add duration to the corresponding hour
    });

    // Map hourly durations to the response
    const timeEntries = hourlyDurations.map((duration, hour) => ({
      label: hour, // Hour labels from 1 to 24
      duration: duration,
    }));

    const totalDuration = hourlyDurations.reduce((total, duration) => total + duration, 0);

    res.json({
      labels: timeEntries.map(entry => entry.label),
      durations: timeEntries.map(entry => entry.duration),
      totalDurationInSeconds: totalDuration,
      totalDurationFormatted: formatDuration(totalDuration),
    });
  } catch (error) {
    console.error('Error calculating total time:', error);
    res.status(500).json({ message: 'Failed to calculate total time. Please try again.' });
  }
});

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


app.get('/total-time-graph/:date', authenticateToken1, async (req, res) => {
  try {
    const dateString = req.params.date; // 'YYYY-MM-DD' format assumed
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0); // Set to start of given date
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set to end of given date

    const timeLogs = await TimeLog.find({
      user: req.user._id,
      startTime: { $gte: date },
      endTime: { $lte: endOfDay }
    }).sort({ startTime: 1 }); // Sort by startTime

    const hourlyDurations = new Array(24).fill(0); // Initialize array for hourly durations
    timeLogs.forEach(log => {
      const hour = log.startTime.getHours();
      hourlyDurations[hour] += log.duration / 60; // Convert to minutes and add to the correct hour
    });

    res.json({
      date: dateString,
      hourlyDurations: hourlyDurations, // Send the hourly durations
    });
  } catch (error) {
    console.error('Error calculating total time for the date:', error);
    res.status(500).json({ message: 'Failed to calculate total time for the date. Please try again.' });
  }
});
app.get('/total-time-graph-weekly/:date', authenticateToken1, async (req, res) => {
  try {
    const inputDate = new Date(req.params.date);
    // Get the first day of the week (Sunday) based on inputDate
    const startOfWeek = new Date(inputDate.setDate(inputDate.getDate() - inputDate.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch logs within the week and map data to days of the week
    const timeLogs = await TimeLog.find({
      user: req.user._id,
      startTime: { $gte: startOfWeek },
      endTime: { $lte: endOfWeek }
    });

    // Initialize array for daily durations
    const dailyDurations = Array.from({ length: 7 }, () => 0);
    timeLogs.forEach(log => {
      const dayOfWeek = log.startTime.getDay(); // Get the day of the week, 0 (Sunday) - 6 (Saturday)
      dailyDurations[dayOfWeek] += log.duration / 60; // Convert to minutes
    });

    res.json({
      weekStarting: startOfWeek.toISOString().split('T')[0],
      dailyDurations: dailyDurations,
    });
  } catch (error) {
    console.error('Error calculating weekly graph data:', error);
    res.status(500).json({ message: 'Failed to calculate weekly graph data. Please try again.' });
  }
});
app.get('/total-time-graph-monthly/:date', authenticateToken1, async (req, res) => {
  try {
    const inputDate = new Date(req.params.date);
    // Get the first and last day of the month
    const startOfMonth = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), 1));
    const endOfMonth = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth() + 1, 0));
    endOfMonth.setHours(23, 59, 59, 999);

    // Fetch logs within the month and map data to each day of the month
    const timeLogs = await TimeLog.find({
      user: req.user._id,
      startTime: { $gte: startOfMonth },
      endTime: { $lte: endOfMonth }
    });

    // Initialize array for daily durations
    const daysInMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0).getDate();
    const dailyDurations = Array.from({ length: daysInMonth }, () => 0);
    timeLogs.forEach(log => {
      const dayOfMonth = log.startTime.getDate() - 1; // Get day of month (0 index)
      dailyDurations[dayOfMonth] += log.duration / 60; // Convert to minutes
    });

    res.json({
      monthStarting: startOfMonth.toISOString().split('T')[0],
      dailyDurations: dailyDurations,
    });
  } catch (error) {
    console.error('Error calculating monthly graph data:', error);
    res.status(500).json({ message: 'Failed to calculate monthly graph data. Please try again.' });
  }
});

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

// Example endpoint to check Gmail authorization status
app.get('/api/gmail/check-authorization', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const client = await loadSavedCredentialsIfExists(username);
  res.status(200).json({ isAuthorized: !!client });
});

app.get('/api/gmail/unread-count', authenticateToken, async (req, res) => {
  const username = req.user.username;  // Assuming this is set by authenticateToken

  const authClient = await authorize2(username);

  try {
      const unreadCount = await countUnreadMessages(authClient);
      res.json({ unreadCount: unreadCount });
  } catch (error) {
      console.error('Failed to count unread messages:', error);
      res.status(500).json({ message: 'Failed to count unread messages.' });
  }
});

app.get('/api/performancereports', authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.find({});

        const aggregatedTimelogs = await TimeLog.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalDuration: { $sum: '$duration' } 
                }
            }
        ]);

        const tasksWithSkillsAndCount = await Task.aggregate([
            {
                $match: {
                    evaluation_status: "completed" 
                }
            },
            {
                $unwind: '$skills' 
            },
            {
                $group: {
                    _id: '$assigned_to', 
                    averageSkills: { $avg: '$skills.rating' }, 
                    completedTasksCount: { $sum: 1 }
                }
            }
        ]);

        // console.log("tasksWithSkillsAndCount", tasksWithSkillsAndCount);

        const skillsAndCountMap = new Map(tasksWithSkillsAndCount.map(item => [
            item._id.toString(), 
            { averageSkills: item.averageSkills, completedTasksCount: item.completedTasksCount }
        ]));
        const durationMap = new Map(aggregatedTimelogs.map(item => [item._id.toString(), item.totalDuration]));

        const performanceReports = employees.map(employee => {
            const employeeIdString = employee._id.toString();
            const totalDuration = durationMap.get(employeeIdString) || 0;
            const employeeSkillsAndCount = skillsAndCountMap.get(employeeIdString) || { averageSkills: 0, completedTasksCount: 0 };
            
            return {
                ...employee._doc,
                totalHoursWorked: totalDuration / 3600,
                averageSkills: employeeSkillsAndCount.averageSkills,
                totalCompletedTasks: employeeSkillsAndCount.completedTasksCount
            };
        });

        const formattedData = performanceReports.map(report => {
            let salaryCategory;
            if (report.salary < 50000) {
                salaryCategory = 'low';
            } else if (report.salary > 70000) {
                salaryCategory = 'high';
            } else {
                salaryCategory = 'medium';
            }

            return {
                "Performance Rating": report.averageSkills,
                "Number of Projects": report.totalCompletedTasks,
                "Average Monthly Hours": report.totalHoursWorked,
                "Salary": salaryCategory
            };
        });

        // console.log("formattedData", formattedData);

        const AI_URI = process.env.AI_URI;
        const apiResponse = await axios.post(AI_URI, formattedData);
        const probabilities = apiResponse.data.prediction;
		// console.log(apiResponse.data)

        const performanceReportsWithProbabilities = performanceReports.map((report, index) => ({
            ...report,
            probability: probabilities[index]
        }));

        // console.log("performanceReportsWithProbabilities", performanceReportsWithProbabilities);
        res.json({ employees: performanceReportsWithProbabilities });
    } catch (error) {
        console.error('Error fetching performance reports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/teamperformancereports/managers', authenticateToken, async (req, res) => {
    try {
        const managerId = req.user.username; 

        const manager = await Manager.findById(managerId).populate('department');
        const departmentId = manager.department._id;


        const employees = await Employee.find({ department: departmentId });


		const aggregatedTimelogs = await TimeLog.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalDuration: { $sum: '$duration' } 
                }
            }
        ]);

        const tasksWithSkillsAndCount = await Task.aggregate([
            {
                $match: {
                    evaluation_status: "completed" 
                }
            },
            {
                $unwind: '$skills' 
            },
            {
                $group: {
                    _id: '$assigned_to', 
                    averageSkills: { $avg: '$skills.rating' }, 
                    completedTasksCount: { $sum: 1 }
                }
            }
        ]);

        // console.log("tasksWithSkillsAndCount", tasksWithSkillsAndCount);

        const skillsAndCountMap = new Map(tasksWithSkillsAndCount.map(item => [
            item._id.toString(), 
            { averageSkills: item.averageSkills, completedTasksCount: item.completedTasksCount }
        ]));
        const durationMap = new Map(aggregatedTimelogs.map(item => [item._id.toString(), item.totalDuration]));

        const performanceReports = employees.map(employee => {
            const employeeIdString = employee._id.toString();
            const totalDuration = durationMap.get(employeeIdString) || 0;
            const employeeSkillsAndCount = skillsAndCountMap.get(employeeIdString) || { averageSkills: 0, completedTasksCount: 0 };
            
            return {
                ...employee._doc,
                totalHoursWorked: totalDuration / 3600,
                averageSkills: employeeSkillsAndCount.averageSkills,
                totalCompletedTasks: employeeSkillsAndCount.completedTasksCount
            };
        });

        const formattedData = performanceReports.map(report => {
            let salaryCategory;
            if (report.salary < 50000) {
                salaryCategory = 'low';
            } else if (report.salary > 70000) {
                salaryCategory = 'high';
            } else {
                salaryCategory = 'medium';
            }

            return {
                "Performance Rating": report.averageSkills,
                "Number of Projects": report.totalCompletedTasks,
                "Average Monthly Hours": report.totalHoursWorked,
                "Salary": salaryCategory
            };
        });

        // console.log("formattedData", formattedData);

        const AI_URI = process.env.AI_URI;
        const apiResponse = await axios.post(AI_URI, formattedData);
        const probabilities = apiResponse.data.prediction;

        const performanceReportsWithProbabilities = performanceReports.map((report, index) => ({
            ...report,
            probability: probabilities[index]
        }));
		

        res.json({ team: performanceReportsWithProbabilities });
    } catch (error) {
        console.error('Error fetching team performance reports:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/turnover', authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.find({}).populate('feedback_forms.form');
        const departments = await Department.find({});
		
        const departmentMap = departments.reduce((map, dept) => {
            map[dept._id.toString()] = dept.department_name.trim(); 
            return map;
        }, {});

        const employeesWithAdditionalInfo = employees.map(employee => {
            const filledForms = employee.feedback_forms.filter(feedback => feedback.filled);

            const averageSatisfaction = filledForms.reduce((acc, feedback) => {
                const ratingsSum = feedback.ratingList.reduce((sum, rating) => sum + rating, 0);
                return acc + (ratingsSum / (feedback.ratingList.length || 1));
            }, 0) / (filledForms.length || 1);

            // Attempt to convert date_started to a Date object
			// console.log(employee.date_started)
            const startDate = employee.date_started ? new Date(employee.date_started) : null;
    		// console.log(`Date started for ${employee.employee_name}:`, startDate);

            const currentDate = new Date();
            const tenure = startDate ? Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365)) : 'Start date not available';
            // console.log(`Tenure for ${employee.employee_name}:`, tenure);

            return {
				...employee._doc, // use the raw document directly
				department_name: departmentMap[employee.department.toString()] || 'No Department Found',
				satisfaction_level: filledForms.length ? averageSatisfaction : 0,
				tenure_years: tenure // Should now be a whole number or the error message
			};
        });

		const formattedData = employeesWithAdditionalInfo.map(employee => {
			return {
				"Satisfaction Level": employee.satisfaction_level,
				"Age": employee.age,
				"Years of Experience": employee.years_of_experience,
				"Salary": employee.salary,
				"Promotions": employee.number_of_promotions,
				"Tenure": employee.tenure_years, 
				"Department_HR": employee.department_name === "HR",
				"Department_Marketing": employee.department_name === "Marketing",
				"Department_Operations": employee.department_name === "Operations",
				"Department_Sales": employee.department_name === "Sales",
				"Department_Tech": employee.department_name === "Tech"
		};});

        // console.log("employeesWithAdditionalInfo", employeesWithAdditionalInfo);
		// console.log("formattedData", formattedData);

		const AI_URI = process.env.AI_URI_TO;
		const apiResponse = await axios.post(AI_URI, formattedData);
		const probabilities = apiResponse.data.prediction;
		// console.log(apiResponse.data)
        // Send the modified employee data
        // res.json(employeesWithAdditionalInfo);
		const finalData = employeesWithAdditionalInfo.map((employee, index) => ({
			...employee,
			probability: probabilities[index]
		}));
		// console.log("finalData", finalData);

		res.json({ turnover: finalData });
    } catch (error) {
        console.error('Error fetching turnover data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

