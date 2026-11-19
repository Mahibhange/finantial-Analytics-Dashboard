# FinSight — Financial Data Analytics Dashboard (Vercel-ready)

A static, deployable portfolio project that analyzes 1,200 synthetic financial transactions. It uses HTML, CSS, JavaScript and Chart.js for the dashboard, with a separate SQL script for database analysis.

## Important: no localhost server required for deployment
This version is built as a static website and is compatible with Vercel. It does **not** use Streamlit or require a Python server at runtime. The dashboard reads the included CSV file in the browser.

## Deploy to Vercel
1. Extract this ZIP.
2. Create a GitHub repository and upload **all files and folders inside** `Financial_Data_Analytics_Vercel`.
3. Sign in to Vercel using GitHub.
4. Select **Add New → Project**, then import that repository.
5. Framework Preset: **Other**.
6. Build Command: leave empty.
7. Output Directory: `.` (root directory).
8. Install Command: leave empty.
9. Click **Deploy**.

After deployment, Vercel will provide a public `*.vercel.app` URL. The site is hosted online; visitors do not need to run localhost.

## Run locally (optional only)
You can open `index.html` directly in a browser for a quick preview, but some browsers restrict CSV fetch from file URLs. For the actual requirement, deploy the folder to Vercel using the steps above.

## Features
- KPI cards: income, expenses, net cash flow and completed transaction count
- Filters: city, category and transaction status
- Monthly income vs expense trend
- Expense category doughnut chart
- Payment-method transaction count
- Top merchants by transaction value
- Recent transaction table and filtered CSV export
- Responsive desktop/mobile layout
- SQL queries for aggregation, trends, category analysis, customer ranking and data-quality checks

## SQL analysis
Import `data/financial_transactions.csv` into a SQL database as `transactions`, then execute `sql/analysis_queries.sql`. The script uses SQLite date functions.

## Dataset
`data/financial_transactions.csv` contains 1,200 synthetic records with transaction date, customer ID, category, transaction type, merchant, payment method, amount (INR), city and status. No real bank/customer data is used.

## Resume entry (only after you deploy and understand it)
**Financial Data Analytics Dashboard | SQL, JavaScript, HTML, CSS, Chart.js**
- Analyzed 1,200 synthetic financial transactions to evaluate income, expenses, category-level spending, payment behavior and monthly trends.
- Wrote SQL queries using filtering, aggregation, grouping, sorting and data-quality checks to extract business insights.
- Developed a responsive interactive dashboard with KPI cards, visual analytics, filters and downloadable transaction data; deployed as a static web app on Vercel.

## Interview note
Be transparent that the dataset is synthetic. Explain that the objective was to demonstrate a complete analytics workflow and dashboard, not to report real company financial results.
