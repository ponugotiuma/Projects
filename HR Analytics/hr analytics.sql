create database hr_analytics;

rename table `hr dataset` to hr_dataset;

select * from hr_dataset;

-- Total Employees --
SELECT COUNT(*) AS Total_Employees
FROM hr_dataset;

-- Attrition Count --
SELECT Attrition,
       COUNT(*) AS Employees
FROM hr_dataset
GROUP BY Attrition;

-- Attrition Rate --
SELECT
ROUND(
100.0 *
SUM(CASE WHEN Attrition='Yes' THEN 1 ELSE 0 END)
/ COUNT(*),
2
) AS Attrition_Rate
FROM hr_dataset;

-- Employees by Department --
SELECT Department,
       COUNT(*) AS Employee_Count
FROM hr_dataset
GROUP BY Department
ORDER BY Employee_Count DESC;

-- Attrition by Department --
SELECT Department,
       COUNT(*) AS Attrition_Count
FROM hr_dataset
WHERE Attrition='Yes'
GROUP BY Department
ORDER BY Attrition_Count DESC;

-- Average Salary by Department --
SELECT Department,
       ROUND(AVG(Monthly_Income),2) AS Avg_Salary
FROM hr_dataset
GROUP BY Department
ORDER BY Avg_Salary DESC;

-- Attrition by Job Role --
SELECT Job_Role,
       COUNT(*) AS Attrition_Count
FROM hr_dataset
WHERE Attrition='Yes'
GROUP BY Job_Role
ORDER BY Attrition_Count DESC;

-- Attrition by Overtime --
SELECT Over_Time,
       COUNT(*) AS Attrition_Count
FROM hr_dataset
WHERE Attrition='Yes'
GROUP BY Over_Time;

-- Average Experience by Attrition --
SELECT Attrition,
       AVG(Total_Working_Years) AS Avg_Experience
FROM hr_dataset
GROUP BY Attrition;