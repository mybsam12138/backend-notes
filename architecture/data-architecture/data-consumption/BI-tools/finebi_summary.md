# FineBI Summary

## 1. What is FineBI?

FineBI is a Business Intelligence (BI) tool developed by FanRuan , widely used in China.

It is designed for:
- Business data analysis
- Dashboard creation
- Self-service BI
- Enterprise reporting

---

## 2. Key Characteristics

- Web-based platform (no Desktop required)
- Strong support for Chinese enterprise environments
- Self-service analytics (business users can build reports)
- Can be deployed on-premise (important in China)

---

## 3. Core Features

### Data Connection
- Connect to databases (MySQL, Oracle, PostgreSQL)
- Connect to data warehouse
- Import Excel / CSV

### Data Modeling
- Define relationships between tables
- Create metrics (aggregations, ratios)
- Build semantic layer for business use

### Dashboard Building
- Drag-and-drop interface
- Charts:
  - bar chart
  - line chart
  - pie chart
  - table
- Interactive filters and drill-down

### Self-Service Analysis
- Business users can:
  - filter data
  - create new charts
  - explore data freely

---

## 4. Architecture

```text
Data Source (DB / Warehouse)
        ↓
FineBI Server (Web Platform)
        ↓
Browser (Users)
```

---

## 5. Workflow

1. Connect data source  
2. Build data model (once)  
3. Create dashboards  
4. Users explore data via web  

---

## 6. Languages Used

- SQL → data querying
- Some internal expressions (less complex than DAX)
- Mostly drag-and-drop (low coding)

---

## 7. FineBI vs Power BI

| Item | FineBI | Power BI |
|---|---|---|
| Platform | Web-first | Desktop + Web |
| Deployment | On-premise friendly | Cloud-focused |
| China support | Strong | Limited |
| Data modeling | In web | Mainly in Desktop |
| Collaboration | Built-in | Requires paid license |
| Ease of use | Very easy | Moderate |

---

## 8. Pros

- Fully web-based (no Desktop needed)
- Easy for business users
- Strong support in China
- On-premise deployment
- Good for self-service BI

---

## 9. Cons

- Less powerful modeling compared to Power BI
- Limited advanced calculation capabilities
- Vendor-specific ecosystem

---

## 10. When to Use

Use FineBI when:
- You are in China
- You need on-premise BI solution
- Business users need self-service analysis
- You want web-only BI tool

---

## 11. Comparison with Vue + ECharts

### FineBI
- Ready BI platform
- No coding needed
- Dynamic dashboards
- Self-service analytics

### Vue + ECharts
- Fully custom UI
- Requires backend APIs
- Fixed dashboards (unless you build dynamic logic)

---

## 12. Summary

FineBI is a web-based BI platform popular in China that enables business users to build dashboards and analyze data without heavy development. It is easier to use and deploy compared to Power BI, but less powerful in advanced data modeling.

---

## 13. Interview Answer

FineBI is a web-based business intelligence platform widely used in China. It allows users to connect to data sources, build data models, and create dashboards directly in the browser. Compared to Power BI, it emphasizes ease of use and on-premise deployment, making it suitable for enterprise environments with strong data control requirements.
