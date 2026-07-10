# 🏗️ POS Platform — Platform & Tenant Architecture

## 📌 Overview

Platforma została zaprojektowana jako **multi-tenant SaaS**, dzięki czemu jedna instancja aplikacji może obsługiwać tysiące klientów, zachowując pełną izolację danych.

Architektura zakłada możliwość obsługi:

* pojedynczych sklepów,
* salonów fryzjerskich,
* restauracji,
* sieci lokali,
* franczyz,
* holdingów,
* partnerów (resellerów).

---

# Hierarchia Platformy

```text
Platform
│
├── Tenant
│   │
│   ├── Subscription
│   ├── Members
│   ├── Features
│   │
│   └── Companies
│       │
│       ├── Branches
│       │   │
│       │   ├── Registers
│       │   ├── Warehouses
│       │   └── Employees
│       │
│       ├── Catalog
│       ├── Inventory
│       ├── Sales
│       ├── CRM
│       ├── Booking
│       ├── Reporting
│       ├── Payments
│       └── Settings
│
└── Identity
```

---

# Tenant

Tenant reprezentuje **organizację korzystającą z platformy SaaS**.

Najczęściej:

* jedna firma = jeden tenant,

ale architektura umożliwia również:

* holding posiadający wiele spółek,
* franczyzę,
* sieć restauracji,
* grupę salonów.

---

## tenants

```text
id
name
slug
status

created_at
updated_at
```

Przykład:

```text
tenant

Hair Group

↓

slug

hair-group
```

---

# Subscription

Każdy tenant posiada własną subskrypcję.

## subscriptions

```text
id

tenant_id

plan

status

starts_at

expires_at

trial_until
```

Przykładowe plany:

* Starter
* Standard
* Professional
* Enterprise

---

# Tenant Members

Użytkownicy należą do Tenant, a nie bezpośrednio do firmy.

## tenant_members

```text
id

tenant_id

user_id

role

invited_by

joined_at
```

Przykładowe role:

* Owner
* Administrator
* Manager
* Employee

---

# Tenant Features

Możliwość dynamicznego włączania modułów.

## tenant_features

```text
id

tenant_id

feature

enabled
```

Przykłady:

```text
BOOKING

LOYALTY

ONLINE_ORDERS

KDS

API_ACCESS

MULTI_WAREHOUSE

MULTI_BRANCH

GIFT_CARDS

CRM

REPORTS_ADVANCED
```

Dzięki temu funkcjonalności mogą zależeć od:

* planu abonamentowego,
* wersji Enterprise,
* indywidualnych ustaleń z klientem.

---

# Company

Tenant może posiadać jedną lub wiele firm.

## companies

```text
id

tenant_id

name

tax_number

email

phone

created_at
```

Przykład:

```text
Tenant

Hair Group

↓

Companies

Hair Group Warsaw

Hair Group Kraków

Hair Group Gdańsk
```

Lub:

```text
Tenant

Holding XYZ

↓

Companies

Restaurant A

Restaurant B

Restaurant C
```

---

# Branch

Firma może posiadać wiele oddziałów.

## branches

```text
id

tenant_id

company_id

name

address

timezone
```

Przykład:

```text
Company

Restaurant Warsaw

↓

Branches

Centrum

Galeria

Lotnisko
```

---

# Register

Każdy oddział może posiadać wiele stanowisk POS.

## registers

```text
id

tenant_id

company_id

branch_id

name

device_identifier
```

Przykład:

```text
Register 1

Register 2

Self Checkout

Mobile POS
```

---

# Warehouse

Każdy oddział może posiadać wiele magazynów.

## warehouses

```text
id

tenant_id

company_id

branch_id

name
```

---

# Employees

Pracownicy należą do firmy i mogą pracować w wielu oddziałach.

```text
Tenant

↓

Company

↓

Employee

↓

Branch Assignment
```

---

# Domain Modules

Każda firma posiada własne moduły biznesowe.

```text
Catalog

Inventory

Sales

CRM

Booking

Payments

Reporting

Settings
```

Każdy moduł przechowuje własne dane.

---

# Multi-Tenant Strategy

Każda tabela biznesowa zawiera:

```sql
tenant_id UUID NOT NULL
company_id UUID NOT NULL
```

Przykład:

```text
sales.sales

id

tenant_id

company_id

branch_id

employee_id

customer_id
```

Dlaczego oba identyfikatory?

**tenant_id**

* izolacja danych,
* filtrowanie wszystkich zapytań,
* bezpieczeństwo platformy.

**company_id**

* raportowanie,
* wiele firm w jednym Tenant,
* łatwiejsze grupowanie danych.

---

# Authentication Flow

Logowanie odbywa się do Tenant.

```text
User

↓

Login

↓

Tenant

↓

Permissions

↓

Company

↓

Branch

↓

POS
```

Po zalogowaniu użytkownik może:

* pracować w jednej firmie,
* przełączać się pomiędzy firmami,
* zmieniać oddziały,
* korzystać z wielu kas.

---

# Permissions

Role definiowane są na poziomie Tenant.

```text
Owner

Administrator

Manager

Cashier

Employee
```

Role są zbiorem uprawnień.

Przykładowe uprawnienia:

```text
SALES_CREATE

SALES_CANCEL

SALES_REFUND

REPORTS_VIEW

PRODUCTS_EDIT

WAREHOUSE_EDIT

BOOKINGS_MANAGE

EMPLOYEES_MANAGE
```

---

# Platform Features

Architektura pozwala na łatwe dodanie:

* wielu firm,
* wielu oddziałów,
* wielu magazynów,
* wielu kas,
* wielu języków,
* wielu walut,
* wielu stref czasowych,
* wielu planów abonamentowych,
* franczyz,
* resellerów,
* API Partner,
* White Label.

---

# Final Architecture

```text
Platform
│
├── Tenant
│   │
│   ├── Subscription
│   ├── Members
│   ├── Features
│   │
│   └── Companies
│       │
│       ├── Branches
│       │   ├── Registers
│       │   ├── Warehouses
│       │   └── Employees
│       │
│       ├── Catalog
│       ├── Inventory
│       ├── Sales
│       ├── CRM
│       ├── Booking
│       ├── Payments
│       ├── Reporting
│       └── Settings
│
└── Identity
```

---

# Design Goals

* Multi-tenant od pierwszego dnia.
* Jedna baza danych dla wszystkich klientów.
* Izolacja danych poprzez `tenant_id`.
* Wsparcie dla wielu firm w ramach jednego Tenant.
* Architektura gotowa na rozwój do wersji Enterprise.
* Możliwość skalowania od pojedynczego salonu fryzjerskiego do międzynarodowej sieci handlowej bez zmiany modelu danych.
