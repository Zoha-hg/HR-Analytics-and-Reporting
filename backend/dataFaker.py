import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set seed for reproducibility
np.random.seed(42)

# Number of records
n = 100000

# Generate unique Employee IDs
employee_ids = np.random.choice(range(100000, 999999), n, replace=False)

# Generate Satisfaction Levels
satisfaction_levels = np.random.uniform(low=0.0, high=5.0, size=n)

# Generate Ages
ages = np.random.randint(18, 66, size=n)

# Generate Start Dates within the last 30 years
start_dates = [datetime.now() - timedelta(days=np.random.randint(1, 365*30)) for _ in range(n)]

# Generate Years of Experience ensuring it's always at least 1 year if possible
years_experience = [np.random.randint(0, max(1, age-18)) for age in ages]

# Department categories
departments = ["HR", "Tech", "Sales", "Marketing", "Finance", "Operations"]
department_distribution = np.random.choice(departments, n, p=[0.1, 0.3, 0.2, 0.1, 0.2, 0.1])

# Generate Salaries based on departments and experience
salaries = [np.random.randint(30000, 120000) + 1000 * years for years in years_experience]

# Generate number of Promotions
promotions = [np.random.poisson(lam=0.5) for _ in range(n)]

# Generate Resigned status based on a simple model (for demonstration)
resigned = [1 if np.random.rand() < (5 - sat)/10 else 0 for sat in satisfaction_levels]

# Create DataFrame
data = pd.DataFrame({
    "Employee ID": employee_ids,
    "Satisfaction Level": satisfaction_levels,
    "Age": ages,
    "Start Date": start_dates,
    "Years of Experience": years_experience,
    "Department": department_distribution,
    "Salary": salaries,
    "Promotions": promotions,
    "Resigned": resigned
})

# Save to CSV
data.to_csv("employee_turnover_dataset_2.csv", index=False)






# # Adding fake feedbackform data to the database.
# from faker import Faker
# import random
# from pymongo import MongoClient

# fake = Faker()
# client = MongoClient('mongodb+srv://admin:ipEpayzmlAOB2Fah@maincluster.wx5fayx.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster')
# db = client['test']
# collection = db['feedbacks']

# all_feedbacks = collection.find()
# print(all_feedbacks)
# feedbacks = []
# for feedback in all_feedbacks:
#     feedbacks.append(feedback)

# print(feedbacks)






# import pandas as pd
# import numpy as np
# from datetime import datetime, timedelta

# # Set seed for reproducibility
# np.random.seed(42)

# # Number of records
# n = 10000

# # Generate unique Employee IDs
# employee_ids = np.random.choice(range(10000, 99999), n, replace=False)

# # Generate Satisfaction Levels
# satisfaction_levels = np.random.uniform(low=0.0, high=5.0, size=n)

# # Generate Ages
# ages = np.random.randint(18, 66, size=n)

# # Generate Start Dates within the last 30 years
# start_dates = [datetime.now() - timedelta(days=np.random.randint(1, 365*30)) for _ in range(n)]

# # Generate Years of Experience ensuring it's always at least 1 year if possible
# years_experience = [np.random.randint(0, max(1, age-18)) for age in ages]

# # Department categories
# departments = ["HR", "Tech", "Sales", "Marketing", "Finance", "Operations"]
# department_distribution = np.random.choice(departments, n, p=[0.1, 0.3, 0.2, 0.1, 0.2, 0.1])

# # Generate Salaries based on departments and experience
# salaries = [np.random.randint(30000, 120000) + 1000 * years for years in years_experience]

# # Generate number of Promotions
# promotions = [np.random.poisson(lam=0.5) for _ in range(n)]

# # Generate Resigned status based on a simple model (for demonstration)
# resigned = [1 if np.random.rand() < (5 - sat)/10 else 0 for sat in satisfaction_levels]

# # Create DataFrame
# data = pd.DataFrame({
#     "Employee ID": employee_ids,
#     "Satisfaction Level": satisfaction_levels,
#     "Age": ages,
#     "Start Date": start_dates,
#     "Years of Experience": years_experience,
#     "Department": department_distribution,
#     "Salary": salaries,
#     "Promotions": promotions,
#     "Resigned": resigned
# })

# # Save to CSV
# data.to_csv("employee_turnover_dataset.csv", index=False)
