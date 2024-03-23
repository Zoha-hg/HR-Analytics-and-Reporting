import React from 'react';

const Sidebar = () => {
    const menuItem = [
        {
            title: 'Dashboard',
            icon: 'dashboard_icon',
            path: '/dashboard'
        },
        {
            title: 'Employee',
            icon: 'employee_icon',
            path: '/employee'
        },
        {
            title: 'Feedback',
            icon: 'feedback_icon',
            path: '/feedbackform'
        },
        {
            title: 'Turnover',
            icon: 'turnover_icon',
            path: '/turnover'
        },
        {
            title: 'Calendar',
            icon: 'calendar_icon',
            path: '/calendar'
        },
        {
            title: 'Gmail',
            icon: 'gmail_icon',
            path: '/gmail'
        }
    ]
    return (
        <div className='container'>
            <div className='sidebar'>
                <div className='top-section'>
                    <h1 className='Logo'>Logo</h1>
                    <div className='menu'>
                        <h1 className='menu-title'>Menu</h1>
                        <div className='bars'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;