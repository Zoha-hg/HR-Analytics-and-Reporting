import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import dashboard_icon from './assets/dashboard.png';
import employee_icon from './assets/Employee.svg';
import feedback_icon from './assets/Feedback.svg';
import turnover_icon from './assets/Turnover.svg';
import calendar_icon from './assets/Calendar.svg';
import gmail_icon from './assets/email.svg';
import bold_dashboard_icon from './assets/bold dashboard.svg';
import bold_employee_icon from './assets/Bold employees.svg';
import bold_feedback_icon from './assets/bold feedback.svg';
import bold_turnover_icon from './assets/Bold Turnover.svg';
import bold_calendar_icon from './assets/bold Calendar.svg';
import bold_gmail_icon from './assets/bold email.svg';
import datalogo from './assets/datalogo.svg';
import logo from './assets/logo.png';
import search from './assets/search.svg';
import styles from './Sidebar.module.css'
import options from './assets/options.svg';
import options2 from './assets/options white.svg';

const Sidebar = () => {
    const HRpages = [
        { icon: dashboard_icon, name: 'Dashboard', path: '/dashboard', bold: bold_dashboard_icon},
        // { icon: employee_icon, name: 'Employees', path: '/employeeperformance', bold: bold_employee_icon},
        { icon: feedback_icon, name: 'Feedback Forms', path: '/feedbackform', bold: bold_feedback_icon},
        { icon: turnover_icon, name: 'Turnover', path: '/turnover', bold: bold_turnover_icon},
        { icon: calendar_icon, name: 'Calendar', path: '/calendar', bold: bold_calendar_icon},
        { icon: gmail_icon, name: 'Gmail', path: '/gmail', bold: bold_gmail_icon }
    ];

    const emppages = [
        { icon: dashboard_icon, name: 'Dashboard', path: '/dashboard', bold: bold_dashboard_icon},
        { icon: employee_icon, name: 'Employees', path: '/employees', bold: bold_employee_icon},
        { icon: feedback_icon, name: 'Feedback Forms', path: '/feedbackform', bold: bold_feedback_icon},
        { icon: calendar_icon, name: 'Calendar', path: '/calendar', bold: bold_calendar_icon },
        { icon: gmail_icon, name: 'Gmail', path: '/gmail', bold: bold_gmail_icon}
    ];

    const managerpages = [
        { icon: dashboard_icon, name: 'Dashboard', path: '/dashboard', bold: bold_dashboard_icon},
        { icon: employee_icon, name: 'Employees', path: '/employees', bold: bold_employee_icon},
        { icon: feedback_icon, name: 'Feedback Forms', path: '/feedbackform', bold: bold_feedback_icon},
        { icon: turnover_icon, name: 'Turnover', path: '/turnover', bold: bold_turnover_icon},
        { icon: calendar_icon, name: 'Calendar', path: '/calendar', bold: bold_calendar_icon},
        { icon: gmail_icon, name: 'Gmail', path: '/gmail', bold: bold_gmail_icon }
    ];

    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showExpandedSidebar, setExpandedSidebar] = useState(false);
    const [pages, setPages] = useState([]);
    const [pathname, setPathname] = useState('');
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const [openSideBar, setOpenSideBar] = useState(false);
    const location = useLocation();

    // for fetching user role
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/user-role', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.role === "HR professional" || response.data.role === "Admin") {
                    setPages(HRpages);
                    console.log('HR pages:', HRpages)
                } else if (response.data.role === "Employee") {
                    setPages(emppages);
                } else if (response.data.role === "Manager") {
                    setPages(managerpages);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                alert('Failed to fetch user role. Please log in again.');
                window.location.href = '/login';
            }
        };
        fetchData();
    }, []);

    // for responsive sidebar
    useEffect(() => {
        
        const checkScreenSize = () => {
            setIsSmallScreen(window.matchMedia('(max-width: 800px)').matches);
            setIsMediumScreen(window.matchMedia('(min-width: 801px) and (max-width: 1000px)').matches);
        };
    
        checkScreenSize();
    
        const mediaQuerySmall = window.matchMedia('(max-width: 800px)');
        const mediaQueryMedium = window.matchMedia('(min-width: 801px) and (max-width: 1000px)');
    
        const handleScreenSizeChange = () => {
            setIsSmallScreen(mediaQuerySmall.matches);
            setIsMediumScreen(mediaQueryMedium.matches);
        };
    
        mediaQuerySmall.addEventListener('change', handleScreenSizeChange);
        mediaQueryMedium.addEventListener('change', handleScreenSizeChange);
    
        return () => {
            mediaQuerySmall.removeEventListener('change', handleScreenSizeChange);
            mediaQueryMedium.removeEventListener('change', handleScreenSizeChange);
        };

    }, []);

    // for hiding sidebar on login, signup, and root paths
    useEffect(() => {
        setPathname(location.pathname);
        if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
            console.log('Before setShowSidebar(false):', showSidebar);
            setShowSidebar(false);
            console.log('After setShowSidebar(false):', showSidebar);
        }
        else if((location.pathname === '/dashboard')) {
            setShowSidebar(false);
            setExpandedSidebar(false);
        }
        else {
            setShowSidebar(true);
            setExpandedSidebar(false);

        }
    }, [location.pathname]);

    useEffect(() => {
        console.log('showSidebar value has been updated:', showSidebar && isMediumScreen);
    }, [isMediumScreen]);

    const toggleSideBar = () => {
        setOpenSideBar(!openSideBar);
    }
    return (
        <div>
            {((showSidebar && !showExpandedSidebar && !isSmallScreen) || (showSidebar && isMediumScreen)) && (
                <div>
                    <div className={styles['top-bar']}>
                        <div className={styles["logo"]}>
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className={styles['top-right-bar']}>
                            {/* <div className={styles["search-bar"]}>
                                <input type="text" placeholder="Search..." />
                                <img className={styles["search-icon"]} src={search} alt="Search" />
                            </div> */}
                            <p><Link to={"/"}>Log Out</Link></p>

                        </div>
                    </div>
                    <div className={styles["line"]}></div>
                    <div className={[styles.sidebar, styles['gradient-green']].join(' ')}>
                        <div className={styles['nav-links']}>
                            <ul>
                                {pages.map((page, index) => (
                                    <li className={styles["nav-icon"]} key={index}>
                                        <Link to={page.path}>
                                        <span>
                                            {pathname.includes(page.path) ? (
                                                <div>
                                                    <img src={page.bold} alt={page.name} />

                                                </div>
                                            ) : (
                                                <div>
                                                    <img className={styles["greyed"]} src={page.icon} alt={page.name} />
                                                </div>
                                            )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {((showSidebar && isSmallScreen )) && (
                <div>
                    <div className={styles['top-bar']}>
                        <div className={styles['top-right-bar']}>
                            <button className={styles['toggle_button']} onClick={toggleSideBar}><img src={options}></img></button>
                            <div className={styles["logo"]}>
                                <img src={logo} alt="Logo" />
                            </div>
                        </div>
                        <div className={styles['top-right-bar']}>
                            {/* <div className={styles["search-bar"]}>
                                <input type="text" placeholder="Search..." />
                                <img className={styles["search-icon"]} src={search} alt="Search" />
                            </div> */}
                        <p><Link to={"/"}>Log Out</Link></p>

                        </div>
                    </div>
                    <div className={styles["line"]}></div>
                    {openSideBar && (
                        <div className={[styles.sidebar, styles['gradient-green'], styles['expanded-sidebar']].join(' ')}>
                            <img className={styles["applogo"]} src={datalogo}></img>
                            <div className={styles['nav-links']}>
                                <ul>

                                    <div style={{ display: 'flex', alignItems: 'left', flexDirection: 'row', justifyContent:'space-between', marginRight: '5px'}}>
                                        <li className={styles["mainmenu"]}>MAIN MENU</li>
                                        <li><button className={styles['toggle_button']} onClick={toggleSideBar}><img src={options2}></img></button></li>
                                    </div>

                                    {pages.map((page, index) => (
                                        <li className={styles["nav-icon"]} key={index}>
                                            <Link to={page.path}>
                                                <span>
                                                    {pathname.includes(page.path) ? (
                                                        <div style={{ display: 'flex', alignItems: 'left', flexDirection: 'row'}}>
                                                            <img src={page.bold} alt={page.name} />
                                                            <p className={styles["highlighted"]}>{page.name}</p>

                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'left', flexDirection: 'row'}}>
                                                            <img className={styles["greyed"]} src={page.icon} alt={page.name} />
                                                            <p className={styles["unhighlighted"]}>{page.name}</p>
                                                        </div>
                                                    )}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                    )}
                </div>
            )}
            {showSidebar && showExpandedSidebar && !isSmallScreen && !isMediumScreen &&(
                <div>
                    <div className={styles['expanded-top-bar']}>
                        <div className={styles["logo"]}>
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className={styles['top-right-bar']}>
                            {/* <div className={styles["search-bar"]}>
                                <input type="text" placeholder="Search..." />
                                <img className={styles["search-icon"]} src={search} alt="Search" />
                            </div> */}
                            <p><Link to={"/"}>Log Out</Link></p>
                        </div>
                    </div>
                    <div className={styles["expanded-line"]}></div>
                    <div className={[styles.expanded_sidebar].join(' ')}>
                        <img className={styles["applogo"]} alt="app logo" src={datalogo}></img>
                        <div className={styles['nav-links']}>
                            <ul>
                                <li className={styles["mainmenu"]}>MAIN MENU</li>

                                {pages.map((page, index) => (
                                    <li className={styles["nav-icon"]} key={index}>
                                        <Link to={page.path}>
                                            <span>
                                                {pathname.includes(page.path) ? (
                                                    <div style={{ display: 'flex', alignItems: 'left', flexDirection: 'row'}}>
                                                        <img src={page.bold} alt={page.name} />
                                                        <p className={styles["highlighted"]}>{page.name}</p>

                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'left', flexDirection: 'row'}}>
                                                        <img className={styles["greyed"]} src={page.icon} alt={page.name} />
                                                        <p className={styles["unhighlighted"]}>{page.name}</p>
                                                    </div>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
