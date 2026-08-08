create database superstore_project;

RENAME TABLE `superstore dataset` TO superstore_dataset;

SELECT * FROM superstore_dataset;

-- REVENUE ANALYSIS --
SELECT SUM(Sales) AS Total_Revenue FROM superstore_dataset;
-- PROFIT TRACKING --
SELECT SUM(Profit) AS Total_Profit FROM superstore_dataset;

-- PRODUCT PERFORMANCE --
SELECT 
Category,
SUM(Sales) AS Total_Sales
FROM superstore_dataset
GROUP BY Category
ORDER BY Total_Sales DESC;

-- CATEGORY PERFORMANCE --
SELECT 
Category, Sub_Category, 
SUM(Sales) AS Revenue,
SUM(Profit) AS Profit
FROM superstore_dataset
GROUP BY Category ;

-- REGIONAL SALES ANALYSIS --
SELECT 
Region,
SUM(Sales) AS Revenue,
SUM(Profit) AS Profit
FROM superstore_dataset
GROUP BY Region
ORDER BY Revenue DESC;

-- CITY,STATE ANALYSIS --
SELECT 
City , State, 
SUM(Sales) AS Revenue
FROM superstore_dataset
GROUP BY State
ORDER BY Revenue DESC;

-- QUANTITY ANALYSIS --
SELECT 
Sub_Category,
SUM(Quantity) AS Total_Quantity
FROM superstore_dataset
GROUP BY Sub_Category
ORDER BY Total_Quantity DESC;






