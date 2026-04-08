# Gray Micro App

## 🧠 Overview
Gray Micro App is a lightweight fintech web application designed to simulate core features of a digital foreign account platform. The system enables users to create virtual accounts, perform transfers, and manage multi-currency balances (USD, EUR, GBP).

The application is built with a fullstack architecture:
- Backend: Golang (microservices, gRPC, REST)
- Frontend: React (TypeScript)
- Messaging: Event-driven architecture (Kafka/RabbitMQ/SQS optional)
- Database: PostgreSQL

---

## 🎯 Core Features
- User authentication and onboarding
- Virtual account creation (USD, EUR, GBP)
- Wallet balance management
- Fund transfers (internal simulation)
- Transaction history
- Event-driven notifications (optional)

---

## 🏗️ Architecture
- Microservices-based backend (Golang)
- API Gateway (REST/gRPC)
- Event-driven messaging system
- Frontend SPA (React)

---

## 🎨 Design System

### Theme
Modern fintech UI inspired by simplicity, trust, and clarity.

### Color Palette

Primary Colors:
- Primary Blue: #0052FF
- Dark Blue: #001F54

Secondary Colors:
- Success Green: #00C48C
- Warning Orange: #FFA500
- Error Red: #FF4D4F

Neutral Colors:
- Background: #F7F9FC
- Surface: #FFFFFF
- Border: #E5EAF2

Text Colors:
- Primary Text: #1A1A1A
- Secondary Text: #6B7280
- Disabled Text: #A0AEC0

---

## 🧩 UI Components

### Buttons
- Primary: Blue background (#0052FF), white text
- Secondary: White background, blue border
- Disabled: Greyed out

### Inputs
- Rounded corners (8px)
- Border: #E5EAF2
- Focus: Blue outline (#0052FF)

### Cards
- Background: White
- Border radius: 12px
- Shadow: subtle (0px 4px 12px rgba(0,0,0,0.05))

---

## 📱 Layout

- Sidebar navigation (Dashboard, Accounts, Transfers, Transactions)
- Top navbar (User profile, notifications)
- Main content area (responsive grid)

---

## ⚙️ API Design (Sample)

### Create Account
POST /accounts

Request:
```json
{
  "currency": "USD"
}