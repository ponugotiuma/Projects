-- Total Products --
SELECT COUNT(*) AS Total_Products
FROM supply_chain_data;

-- Distinct Product Types --
SELECT DISTINCT `Product type`
FROM supply_chain_data;

-- Number of Suppliers --
SELECT COUNT(DISTINCT `Supplier name`) AS Total_Suppliers
FROM supply_chain_data;

-- Number of Transportation Modes --
SELECT DISTINCT `Transportation modes`
FROM supply_chain_data;

-- Number of Shipping Carriers --
SELECT DISTINCT `Shipping carriers`
FROM supply_chain_data;

-- Total Stock Available --
SELECT
SUM(`Stock levels`) AS Total_Stock
FROM supply_chain_data;

-- Average Stock Level --
SELECT
ROUND(AVG(`Stock levels`),2) AS Average_Stock
FROM supply_chain_data;

-- Products with Lowest Stock --
SELECT
SKU,
`Product type`,
`Stock levels`
FROM supply_chain_data
ORDER BY `Stock levels` ASC
LIMIT 10;

-- Products with Highest Stock --
SELECT
SKU,
`Product type`,
`Stock levels`
FROM supply_chain_data
ORDER BY `Stock levels` DESC
LIMIT 10;

-- Inventory Value --
SELECT
ROUND(SUM(Price * `Stock levels`),2) AS Inventory_Value
FROM supply_chain_data;

-- Inventory Value by Product Type --
SELECT
`Product type`,
ROUND(SUM(Price * `Stock levels`),2) AS Inventory_Value
FROM supply_chain_data
GROUP BY `Product type`
ORDER BY Inventory_Value DESC;

-- Average Stock by Product Type --
SELECT
`Product type`,
ROUND(AVG(`Stock levels`),2) AS Avg_Stock
FROM supply_chain_data
GROUP BY `Product type`
ORDER BY Avg_Stock DESC;

-- Products with High Stock but Low Sales --
SELECT
SKU,
`Product type`,
`Stock levels`,
`Number of products sold`
FROM supply_chain_data
WHERE `Stock levels` > (
    SELECT AVG(`Stock levels`)
    FROM supply_chain_data
)
AND `Number of products sold` < (
    SELECT AVG(`Number of products sold`)
    FROM supply_chain_data
)
ORDER BY `Stock levels` DESC;

-- List All Suppliers --
SELECT DISTINCT `Supplier name`
FROM supply_chain_data
ORDER BY `Supplier name`;

-- Number of Products Handled by Each Supplier --
SELECT
    `Supplier name`,
    COUNT(SKU) AS Products_Handled
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Products_Handled DESC;

-- Average Supplier Lead Time --
SELECT
    `Supplier name`,
    ROUND(AVG(`Lead time`), 2) AS Avg_Supplier_Lead_Time
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Avg_Supplier_Lead_Time ASC;

-- Average Manufacturing Lead Time by Supplier --
SELECT
    `Supplier name`,
    ROUND(AVG(`Manufacturing lead time`), 2)
        AS Avg_Manufacturing_Lead_Time
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Avg_Manufacturing_Lead_Time ASC;

-- Average Manufacturing Cost by Supplier --
SELECT
    `Supplier name`,
    ROUND(AVG(`Manufacturing costs`), 2)
        AS Avg_Manufacturing_Cost
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Avg_Manufacturing_Cost ASC;

-- Total Production Volume by Supplier --
SELECT
    `Supplier name`,
    SUM(`Production volumes`) AS Total_Production_Volume
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Total_Production_Volume DESC;

-- Average Defect Rate by Supplier --
SELECT
    `Supplier name`,
    ROUND(AVG(`Defect rates`), 2) AS Avg_Defect_Rate
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Avg_Defect_Rate ASC;

-- Supplier Inspection Results --
SELECT
    `Supplier name`,
    `Inspection results`,
    COUNT(*) AS Inspection_Count
FROM supply_chain_data
GROUP BY
    `Supplier name`,
    `Inspection results`
ORDER BY
    `Supplier name`,
    Inspection_Count DESC;
    
-- Failed Inspections by Supplier --
SELECT
    `Supplier name`,
    COUNT(*) AS Failed_Inspections
FROM supply_chain_data
WHERE LOWER(`Inspection results`) = 'fail'
GROUP BY `Supplier name`
ORDER BY Failed_Inspections DESC;

SELECT DISTINCT `Inspection results`
FROM supply_chain_data;

-- High-Defect Supplier Products --
SELECT
    `Supplier name`,
    SKU,
    `Product type`,
    ROUND(`Defect rates`, 2) AS Defect_Rate
FROM supply_chain_data
WHERE `Defect rates` >
(
    SELECT AVG(`Defect rates`)
    FROM supply_chain_data
)
ORDER BY Defect_Rate DESC;

-- Supplier Performance Summary --
SELECT
    `Supplier name`,
    COUNT(SKU) AS Products_Handled,
    SUM(`Production volumes`) AS Total_Production_Volume,
    ROUND(AVG(`Lead time`), 2) AS Avg_Lead_Time,
    ROUND(AVG(`Manufacturing lead time`), 2)
        AS Avg_Manufacturing_Lead_Time,
    ROUND(AVG(`Manufacturing costs`), 2)
        AS Avg_Manufacturing_Cost,
    ROUND(AVG(`Defect rates`), 2) AS Avg_Defect_Rate
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Avg_Defect_Rate ASC, Avg_Lead_Time ASC;

-- Rank Suppliers by Defect Rate --
SELECT
    `Supplier name`,
    ROUND(AVG(`Defect rates`), 2) AS Avg_Defect_Rate,
    DENSE_RANK() OVER (
        ORDER BY AVG(`Defect rates`) ASC
    ) AS Quality_Rank
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Quality_Rank;

-- Rank Suppliers by Lead Time --
SELECT
    `Supplier name`,
    ROUND(AVG(`Lead time`), 2) AS Avg_Lead_Time,
    DENSE_RANK() OVER (
        ORDER BY AVG(`Lead time`) ASC
    ) AS Lead_Time_Rank
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Lead_Time_Rank;

-- Supplier Efficiency Score --
SELECT
    `Supplier name`,
    ROUND(AVG(`Lead time`), 2) AS Avg_Lead_Time,
    ROUND(AVG(`Manufacturing costs`), 2)
        AS Avg_Manufacturing_Cost,
    ROUND(AVG(`Defect rates`), 2) AS Avg_Defect_Rate,
    ROUND(
        AVG(`Lead time`) +
        AVG(`Manufacturing costs`) +
        AVG(`Defect rates`),
        2
    ) AS Supplier_Efficiency_Score
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Supplier_Efficiency_Score ASC;

-- Order Fulfilment Performance by Product Type --
SELECT
    `Product type`,
    SUM(`Order quantities`) AS Total_Orders,
    SUM(`Number of products sold`) AS Total_Units_Sold,
    ROUND(AVG(`Shipping times`), 2) AS Avg_Shipping_Time,
    ROUND(
        SUM(`Number of products sold`) /
        NULLIF(SUM(`Order quantities`), 0) * 100,
        2
    ) AS Fulfilment_Rate_Percentage
FROM supply_chain_data
GROUP BY `Product type`
ORDER BY Fulfilment_Rate_Percentage DESC;

-- Complete Lead-Time Analysis --
SELECT
    `Supplier name`,
    ROUND(AVG(`Lead time`), 2) AS Avg_Supplier_Lead_Time,
    ROUND(AVG(`Manufacturing lead time`), 2)
        AS Avg_Manufacturing_Lead_Time,
    ROUND(AVG(`Shipping times`), 2) AS Avg_Shipping_Time,
    ROUND(
        AVG(`Lead time`) +
        AVG(`Manufacturing lead time`) +
        AVG(`Shipping times`),
        2
    ) AS Avg_Total_Lead_Time
FROM supply_chain_data
GROUP BY `Supplier name`
ORDER BY Avg_Total_Lead_Time ASC;

-- Products with Above-Average Total Lead Time --
SELECT
    SKU,
    `Product type`,
    `Supplier name`,
    `Lead time`,
    `Manufacturing lead time`,
    `Shipping times`,
    (
        `Lead time` +
        `Manufacturing lead time` +
        `Shipping times`
    ) AS Total_Lead_Time
FROM supply_chain_data
WHERE
    (
        `Lead time` +
        `Manufacturing lead time` +
        `Shipping times`
    ) >
    (
        SELECT AVG(
            `Lead time` +
            `Manufacturing lead time` +
            `Shipping times`
        )
        FROM supply_chain_data
    )
ORDER BY Total_Lead_Time DESC;

-- Logistics Performance by Transportation Mode --
SELECT
    `Transportation modes`,
    COUNT(SKU) AS Total_Shipments,
    ROUND(AVG(`Shipping times`), 2) AS Avg_Shipping_Time,
    ROUND(SUM(`Shipping costs`), 2) AS Total_Shipping_Cost,
    ROUND(SUM(`Costs`), 2) AS Total_Transportation_Cost,
    ROUND(
        SUM(`Shipping costs`) + SUM(`Costs`),
        2
    ) AS Total_Logistics_Cost
FROM supply_chain_data
GROUP BY `Transportation modes`
ORDER BY Total_Logistics_Cost DESC;

-- Shipping Carrier Performance --
SELECT
    `Shipping carriers`,
    COUNT(SKU) AS Products_Shipped,
    ROUND(AVG(`Shipping times`), 2) AS Avg_Shipping_Time,
    ROUND(AVG(`Shipping costs`), 2) AS Avg_Shipping_Cost,
    ROUND(SUM(`Shipping costs`), 2) AS Total_Shipping_Cost
FROM supply_chain_data
GROUP BY `Shipping carriers`
ORDER BY Avg_Shipping_Cost ASC, Avg_Shipping_Time ASC;

-- Quality Performance by Product Type --
SELECT
    `Product type`,
    ROUND(AVG(`Defect rates`), 2) AS Avg_Defect_Rate,
    SUM(
        CASE
            WHEN LOWER(`Inspection results`) = 'pass' THEN 1
            ELSE 0
        END
    ) AS Passed_Inspections,
    SUM(
        CASE
            WHEN LOWER(`Inspection results`) = 'fail' THEN 1
            ELSE 0
        END
    ) AS Failed_Inspections,
    SUM(
        CASE
            WHEN LOWER(`Inspection results`) = 'pending' THEN 1
            ELSE 0
        END
    ) AS Pending_Inspections
FROM supply_chain_data
GROUP BY `Product type`
ORDER BY Avg_Defect_Rate ASC;

-- Product-Type Financial Performance --
SELECT
    `Product type`,
    SUM(`Number of products sold`) AS Units_Sold,
    ROUND(SUM(`Revenue generated`), 2) AS Total_Revenue,
    ROUND(SUM(`Manufacturing costs`), 2)
        AS Total_Manufacturing_Cost,
    ROUND(SUM(`Shipping costs`), 2)
        AS Total_Shipping_Cost,
    ROUND(SUM(`Costs`), 2)
        AS Total_Transportation_Cost,
    ROUND(
        SUM(`Revenue generated`) -
        SUM(`Manufacturing costs`) -
        SUM(`Shipping costs`) -
        SUM(`Costs`),
        2
    ) AS Estimated_Profit
FROM supply_chain_data
GROUP BY `Product type`
ORDER BY Estimated_Profit DESC;

-- Executive KPI Dashboard Query --
SELECT
    COUNT(DISTINCT SKU) AS Total_SKUs,
    COUNT(DISTINCT `Supplier name`) AS Total_Suppliers,
    SUM(`Number of products sold`) AS Total_Units_Sold,
    SUM(`Order quantities`) AS Total_Order_Quantity,
    SUM(`Stock levels`) AS Total_Current_Stock,

    ROUND(SUM(`Revenue generated`), 2) AS Total_Revenue,

    ROUND(AVG(`Lead time`), 2) AS Avg_Supplier_Lead_Time,
    ROUND(AVG(`Manufacturing lead time`), 2)
        AS Avg_Manufacturing_Lead_Time,
    ROUND(AVG(`Shipping times`), 2) AS Avg_Shipping_Time,

    ROUND(AVG(`Defect rates`), 2) AS Avg_Defect_Rate,

    ROUND(SUM(`Shipping costs`), 2) AS Total_Shipping_Cost,
    ROUND(SUM(`Costs`), 2) AS Total_Transportation_Cost,

    ROUND(
        SUM(`Number of products sold`) /
        NULLIF(SUM(`Order quantities`), 0) * 100,
        2
    ) AS Overall_Fulfilment_Rate,

    ROUND(
        SUM(`Revenue generated`) -
        SUM(`Manufacturing costs`) -
        SUM(`Shipping costs`) -
        SUM(`Costs`),
        2
    ) AS Estimated_Operational_Profit
FROM supply_chain_data;

-- view (supply chain analysis)  --
CREATE VIEW supply_chain_analysis AS
SELECT
    SKU,
    `Product type`,
    `Supplier name`,
    `Shipping carriers`,
    `Transportation modes`,
    `Location`,
    `Price`,
    `Availability`,
    `Stock levels`,
    `Order quantities`,
    `Number of products sold`,
    `Revenue generated`,
    `Lead time`,
    `Manufacturing lead time`,
    `Shipping times`,
    `Manufacturing costs`,
    `Shipping costs`,
    `Costs`,
    `Defect rates`,
    `Inspection results`,

    (`Price` * `Stock levels`) AS Calculated_Inventory_Value,

    (
        `Lead time` +
        `Manufacturing lead time` +
        `Shipping times`
    ) AS Total_Lead_Time,

    (
        `Shipping costs` + `Costs`
    ) AS Total_Logistics_Cost,

    (
        `Revenue generated` -
        `Manufacturing costs` -
        `Shipping costs` -
        `Costs`
    ) AS Estimated_Profit,

    CASE
        WHEN `Stock levels` < `Order quantities`
            THEN 'Potential Stock Shortage'
        WHEN `Stock levels` > (`Order quantities` * 2)
            THEN 'Potential Overstock'
        ELSE 'Balanced Inventory'
    END AS Inventory_Status,

    CASE
        WHEN `Defect rates` >
            (SELECT AVG(`Defect rates`) FROM supply_chain_data)
            THEN 'High Defect Rate'
        ELSE 'Acceptable Defect Rate'
    END AS Quality_Status

FROM supply_chain_data;