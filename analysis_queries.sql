-- Financial Data Analytics Project
-- Run this script in SQLite / DB Browser for SQLite.
-- Import data/financial_transactions.csv into a table named transactions first.

-- 1. View all completed transactions
SELECT * FROM transactions WHERE status = 'Completed';

-- 2. Total income, expenses and refunds
SELECT transaction_type, ROUND(SUM(amount), 2) AS total_amount
FROM transactions
WHERE status = 'Completed'
GROUP BY transaction_type;

-- 3. Monthly income and expense trend
SELECT strftime('%Y-%m', transaction_date) AS month,
       transaction_type, ROUND(SUM(amount), 2) AS total_amount
FROM transactions
WHERE status = 'Completed'
  AND transaction_type IN ('Income', 'Expense')
GROUP BY month, transaction_type
ORDER BY month;

-- 4. Category-wise expense analysis
SELECT category, ROUND(SUM(amount), 2) AS total_expense
FROM transactions
WHERE status = 'Completed' AND transaction_type = 'Expense'
GROUP BY category
ORDER BY total_expense DESC;

-- 5. Top 10 customers by total completed transaction value
SELECT customer_id, ROUND(SUM(amount), 2) AS transaction_value
FROM transactions
WHERE status = 'Completed'
GROUP BY customer_id
ORDER BY transaction_value DESC
LIMIT 10;

-- 6. Payment method usage
SELECT payment_method, COUNT(*) AS transaction_count,
       ROUND(SUM(amount), 2) AS total_amount
FROM transactions
WHERE status = 'Completed'
GROUP BY payment_method
ORDER BY transaction_count DESC;

-- 7. Failed and pending transaction rate
SELECT status, COUNT(*) AS transaction_count,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM transactions), 2) AS percentage
FROM transactions
GROUP BY status;

-- 8. Net cash flow by city (income + refunds - expenses)
SELECT city,
       ROUND(SUM(CASE WHEN transaction_type IN ('Income','Refund') THEN amount
                      WHEN transaction_type = 'Expense' THEN -amount ELSE 0 END), 2) AS net_cash_flow
FROM transactions
WHERE status = 'Completed'
GROUP BY city
ORDER BY net_cash_flow DESC;

-- 9. Average transaction amount by category
SELECT category, ROUND(AVG(amount), 2) AS average_amount
FROM transactions
WHERE status = 'Completed'
GROUP BY category
ORDER BY average_amount DESC;

-- 10. Duplicate transaction ID check
SELECT transaction_id, COUNT(*) AS duplicate_count
FROM transactions
GROUP BY transaction_id
HAVING COUNT(*) > 1;
