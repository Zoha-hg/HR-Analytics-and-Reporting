import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./CreateForm.css";

function DisplayForms() {
    const [forms, setForms] = useState([]);
    const [username, setUsername] = useState("");
    const [user_role, setUserRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("token");
            try {
                // Make a GET request to the /user-role endpoint to extract the user's role based on the token
                const response = await axios.get(
                    "https://hr-analytics-and-reporting-production.up.railway.app/user-role",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUserRole(response.data.role);
                console.log("response ", response.data.role);
                console.log("user_role: ", user_role);
                return response.data.role;
            } catch (error) {
                console.error("Error fetching user role:", error);
                // If there's an error, redirect to the login page
                alert("Failed to fetch user role. Please log in again.");
                navigate("/login");
            }
        };

        const fetchUserName = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(
                    "https://hr-analytics-and-reporting-production.up.railway.app/user-name",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUsername(response.data.username);
                return response.data.username;
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };

        const fetchData = async (username, role) => {
            try {
                console.log("role ", role, "!", username);
                const response = await axios.post(
                    "https://hr-analytics-and-reporting-production.up.railway.app/displayforms",
                    { user: username, user_role: role }
                );
                console.log("response.data: ", response.data);
                setForms(response.data);
                if (user_role === "HR professional") {
                    console.log("user_roleeee: ", user_role);
                } else {
                    console.log("user_role: ", user_role);
                }
            } catch (error) {
                console.error("Error fetching forms:", error);
            }
        };

        const getData = async () => {
            let role = await fetchUserRole();
            let username = await fetchUserName();
            fetchData(username, role);
            // setUsername(username);
        };

        getData();
    }, []);

    const handleGoToForm = async (form_id) => {
        // const user_role = getUserRole(username);
        if (user_role === "Employee" || user_role === "Manager") {
            console.log("going to form " + form_id);
            window.location.href =
                "/feedbackform/fillform/?feedback_id=" + form_id;
        } else {
            console.log("going to display form results");
            window.location.href =
                "/feedbackform/displayresults/?form_id=" + form_id;
        }
    };

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5);

    // for (let i = 0; i < forms.length; i++) {
    //     console.log(
    //         "form ",
    //         i,
    //         ": ",
    //         new Date(forms[i].end_time),
    //         " ",
    //         new Date(forms[i].start_time),
    //         " ",
    //         currentDate,
    //         " and title: ",
    //         forms[i].title
    //     );
    // }
    const filledForms = forms.filter(
        (form) => form.filled || new Date(form.end_time).toLocaleString() < currentDate
    );
    const unfilledForms = forms.filter(
        (form) =>
            !form.filled &&
            new Date(form.start_time).toLocaleString() <= currentDate.toLocaleString() &&
            new Date(form.end_time).toLocaleString() >= currentDate.toLocaleString()
    );

    const endedForms = forms.filter(
        (form) => new Date(form.end_time).toLocaleString() < currentDate.toLocaleString()
    );
    const ongoingForms = forms.filter(
        (form) =>
            new Date(form.start_time).toLocaleString() <= currentDate.toLocaleString() &&
            new Date(form.end_time).toLocaleString() >= currentDate.toLocaleString()
    );

    // console.log("filledForms: ", filledForms);
    // console.log("unfilledForms: ", unfilledForms);
    console.log("endedForms: ", endedForms);
    console.log("ongoingForms: ", ongoingForms);
    const formatDate = (date) => {
        const year = date.split("-")[0];
        const month = date.split("-")[1];
        const day = date.split("-")[2].split("T")[0];
        return day + "/" + month + "/" + year;
    };

    return (
        <div className="container forms">
            <div>
                {user_role === "HR professional" && (
                    <div>
                        <div>
                            <h1>Feedback Forms</h1>
                            <Link to="/feedbackform/createform">
                                <button className="createform">
                                    Create a Form
                                </button>
                            </Link>
                        </div>
                        <div className="incomplete-forms">
                            <h2>Finished</h2>
                            <ul className="form-cards">
                                {endedForms.length > 0 ? (
                                    <ul>
                                        {endedForms.map((form) => (
                                            <li key={form.form_id}>
                                                <button
                                                    className="form-button"
                                                    type="button"
                                                    onClick={() =>
                                                        handleGoToForm(
                                                            form.form_id
                                                        )
                                                    }
                                                >
                                                    <h3>{form.title}</h3>
                                                    <h4>
                                                        Start:{" "}
                                                        {formatDate(
                                                            form.start_time
                                                        )}
                                                    </h4>
                                                    <h4>
                                                        Due:{" "}
                                                        {formatDate(
                                                            form.end_time
                                                        )}
                                                    </h4>
                                                    <p>{form.description}</p>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>None</p>
                                )}
                            </ul>
                        </div>
                        <div className="complete-forms">
                            <h2>Ongoing</h2>
                            <ul>
                                {ongoingForms.length > 0 ? (
                                    <ul style={{ listStyleType: "none" }}>
                                        {ongoingForms.map((form) => (
                                            <li key={form.form_id}>
                                                <div className="form-card">
                                                    <h3>{form.title}</h3>
                                                    <h4>
                                                        Start Time:{" "}
                                                        {formatDate(
                                                            form.start_time
                                                        )}
                                                    </h4>
                                                    <h4>
                                                        Due:{" "}
                                                        {formatDate(
                                                            form.end_time
                                                        )}
                                                    </h4>
                                                    <p>{form.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>None</p>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {(user_role === "Employee" || user_role === "Manager") && (
                    <div>
                        <h1>Feedback Forms</h1>
                        <div>
                            <div className="incomplete-forms">
                                <h2>Incomplete</h2>
                                <ul className="form-cards">
                                    {unfilledForms.length > 0 ? (
                                        <ul>
                                            {unfilledForms.map((form) => (
                                                <li key={form.form_id}>
                                                    <button
                                                        className="form-button"
                                                        type="button"
                                                        onClick={() =>
                                                            handleGoToForm(
                                                                form.form_id
                                                            )
                                                        }
                                                    >
                                                        <h3>{form.title}</h3>
                                                        <h4>
                                                            Due:{" "}
                                                            {formatDate(
                                                                form.end_time
                                                            )}
                                                        </h4>
                                                        <p>
                                                            {form.description}
                                                        </p>
                                                        {/* <p>Start Time: {form.start_time}</p> */}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div>
                                            <p>None</p>
                                        </div>
                                    )}
                                </ul>
                            </div>
                            <div className="complete-forms">
                                <h2>Complete</h2>
                                <ul>
                                    {filledForms.length > 0 ? (
                                        <ul className="form-cards">
                                            {filledForms.map((form) => (
                                                <li key={form.form_id}>
                                                    <div className="form-card">
                                                        <h3>{form.title}</h3>
                                                        <h4>
                                                            Due:{" "}
                                                            {formatDate(
                                                                form.end_time
                                                            )}
                                                        </h4>
                                                        <p>
                                                            {form.description}
                                                        </p>
                                                        {/* <p>Start Time: {form.start_time}</p> */}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ border: "none" }}>None</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DisplayForms;
