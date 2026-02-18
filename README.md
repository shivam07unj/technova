# FinSight Cross-Sell Platform  
### AI-Powered Intelligent Banking Recommendation System

---

## 🚀 Overview

FinSight Cross-Sell Platform is an AI-driven banking intelligence system designed to replace generic marketing spam with personalized, data-driven product recommendations.

The system analyzes customer transaction history, demographics, life events, and risk profile to identify the most relevant financial products for each user.

It generates personalized, compliant messages and tracks engagement metrics to improve cross-sell conversion rates.

---

## 🎯 Problem Statement

Banks offer multiple financial products such as credit cards, loans, insurance, and investments. However, customers often receive irrelevant and generic offers, leading to poor engagement and low conversion.

This project solves that by building:

- An intelligent cross-sell decision engine
- Personalized offer generation using AI
- Data-backed recommendation logic
- Offer tracking and analytics dashboard

---

## 🧠 Key Features

- 🔍 Life Event Detection from transaction patterns
- 📊 Risk & Credit Eligibility Evaluation
- 🎯 Next Best Product Recommendation
- ✍️ Gemini AI-powered personalized message generation
- 🛡 Compliance validation layer
- 📈 Offer tracking & conversion analytics
- 👥 Admin dashboard for user insights
- 🗄 Supabase-powered relational database

---

## 🏗 Architecture

### Frontend
- React (Vite)
- Modular page structure (Dashboard, Users, User Details)
- Admin-style banking interface

### Backend
- FastAPI
- Modular service architecture
- AI orchestration pipeline

### Database
- Supabase (PostgreSQL)
- Tables:
  - users
  - transactions
  - products
  - offers

### AI Layer
- Google Gemini API
- Structured prompt engineering
- Guardrail + compliance validation

---

## 🔄 AI Analysis Pipeline

1. Fetch user profile and transaction history
2. Detect life events from spending patterns
3. Evaluate credit eligibility
4. Select best-fit product
5. Generate personalized offer using Gemini
6. Validate compliance
7. Store offer in database
8. Update analytics dashboard

---

## 📊 Data Model

### Users
- Demographics
- Income
- Credit score
- Risk category
- Preferred communication channel

### Transactions
- Category
- Merchant
- Amount
- Timestamp

### Offers
- Life event detected
- Product recommended
- Propensity score
- Generated message
- Channel used
- Clicked / Converted status

---

## 🛠 Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <repo-url>
cd project-folder
