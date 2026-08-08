CREATE DATABASE churn_analysis;

SELECT * 
FROM telco_customer_churn;

-- TOTAL CUSTOMERS --
SELECT COUNT(*) AS total_customers
FROM telco_customer_churn;

-- TOTAL CHURNED CUSTOMERS --
SELECT COUNT(*) AS churned_customers
FROM telco_customer_churn
WHERE Churn = 'Yes';

-- CHURN RATE --
SELECT 
    ROUND(
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) * 100.0
        / COUNT(*),
        2
    ) AS churn_rate
FROM telco_customer_churn;

-- CHURN BY CONTRACT TYPE --
SELECT
    Contract,
    COUNT(*) AS total_customers,
    SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_customers,
    ROUND(
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) * 100.0
        / COUNT(*),
        2
    ) AS churn_rate
FROM telco_customer_churn
GROUP BY Contract
ORDER BY churn_rate DESC;

-- AVERAGE MONTHLY CHARGES OF CHURNED CUSTOMERS --
SELECT
    ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_charges
FROM telco_customer_churn
WHERE Churn = 'Yes';

-- CHURN BY PAYMENT METHOD --
SELECT
    PaymentMethod,
	COUNT(*) AS total_customers,
	SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_customers,
	ROUND(
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) * 100.0
        / COUNT(*),
        2
    ) AS churn_rate
FROM telco_customer_churn
GROUP BY PaymentMethod
ORDER BY churn_rate DESC;

-- TENURE ANALYSIS --
SELECT
    Churn,
    ROUND(AVG(tenure), 2) AS avg_tenure
FROM telco_customer_churn
GROUP BY Churn;

-- HIGH VALUE CUSTOMERS --
SELECT
    customerID,
    MonthlyCharges,
    TotalCharges
FROM telco_customer_churn
ORDER BY TotalCharges DESC;

-- TECH SUPPORT IMPACT --
SELECT
    TechSupport,
	COUNT(*) AS total_customers,
	ROUND(
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) * 100.0
        / COUNT(*),
        2
    ) AS churn_rate
FROM telco_customer_churn
GROUP BY TechSupport;

-- CUSTOMER SEGMENTATION --
SELECT
    CASE
		WHEN tenure <= 12 THEN 'New Customer'
        WHEN tenure <= 36 THEN 'Regular Customer'
		WHEN tenure <= 60 THEN 'Loyal Customer'
		ELSE 'VIP Customer'
	END AS customer_segment,
    COUNT(*) AS total_customers,
	ROUND(
        SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) * 100.0
        / COUNT(*),
        2
    ) AS churn_rate
FROM telco_customer_churn
GROUP BY customer_segment
ORDER BY churn_rate DESC;




