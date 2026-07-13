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

# Terminologia (kanoniczna)

Jeden słownik pojęć obowiązujący w **schemacie DB, kontraktach (`@repo/contracts`) i URL-ach API**. W razie konfliktu — ta tabela wygrywa.

| Pojęcie (PL)            | Termin kanoniczny | Tabela / identyfikator | Rodzic   | Uwagi                                            |
| ----------------------- | ----------------- | ---------------------- | -------- | ------------------------------------------------ |
| Platforma               | Platform          | —                      | —        | cała instancja SaaS                              |
| Organizacja klienta     | **Tenant**        | `tenants`              | Platform | **granica izolacji danych**                      |
| Subskrypcja             | **Subscription**  | `subscriptions`        | Tenant   | plan, status, trial                              |
| Członek organizacji     | **Member**        | `tenant_members`       | Tenant   | powiązanie user ↔ tenant + rola                  |
| Włączany moduł          | **Feature**       | `tenant_features`      | Tenant   | flagi funkcji (BOOKING, LOYALTY…)                |
| Firma (podmiot prawny)  | **Company**       | `companies`            | Tenant   | NIP, dane fakturowe, poziom raportowania         |
| Oddział / lokal         | **Branch**        | `branches`             | Company  | fizyczna lokalizacja (było: `locations`)         |
| Kasa / stanowisko POS   | **Register**      | `registers`            | Branch   | terminal POS                                     |
| Magazyn                 | **Warehouse**     | `warehouses`           | Branch   | stan magazynowy                                  |
| Pracownik               | **Employee**      | `employees`            | Company  | przypisania do wielu oddziałów                   |
| Tożsamość / logowanie   | **User**          | `users` / Cognito      | Platform | uwierzytelnianie (patrz: plan Auth)              |

**Moduły domenowe** (własne dane per Company): `catalog`, `inventory`, `sales`, `crm`, `booking`, `payments`, `reporting`, `settings`.

## Konwencje nazewnicze

* Tabele: `snake_case`, liczba mnoga (`tenant_members`).
* Kolumny: `snake_case`; klucze obce: `tenant_id`, `company_id`, `branch_id`.
* Identyfikatory w TS/Drizzle: `camelCase`, eksport tabeli w liczbie mnogiej (`export const branches`).
* Klucze główne: `uuid` (`defaultRandom()`).
* URL API: `snake`/kebab w ścieżkach REST, wersjonowane — `/api/v1/tenants`, `/api/v1/companies`…
* **Każda tabela biznesowa** niesie `tenant_id` (+ `company_id` tam, gdzie dotyczy).

> ✅ Zrealizowane (migracja `0001_tenant_subtree`): `tenants`, `companies`, `branches` (rename z `locations`, wpięte pod `companies`), `subscriptions`, `tenant_members`, `tenant_features`. Kolejny etap: `registers`, `warehouses`, `employees`.

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

## Strategia izolacji — defense-in-depth (2 warstwy)

Stosujemy **obie** warstwy jednocześnie: aplikacyjną (szybka, wygodna) i bazodanową (ostatnia linia obrony).

### Warstwa 1 — App-level scoping

Repozytoria **nigdy** nie odpytują tabeli biznesowej bez filtra po `tenant_id`. Wzorzec: repozytorium to **fabryka domknięta nad `tenantId`** — nie da się wywołać metody bez podania Tenanta (implementacja: `modules/companies/repository.ts`, `modules/branches/repository.ts`):

```ts
export function companyRepository(tenantId: string) {
  return {
    list: () =>
      db.select(columns).from(companies)
        .where(eq(companies.tenantId, tenantId)),
    create: (data) =>
      db.insert(companies).values({ ...data, tenantId }).returning(columns),
    findById: (id) =>
      db.select(columns).from(companies)
        .where(and(eq(companies.tenantId, tenantId), eq(companies.id, id))),
  };
}
```

`tenantId` pochodzi z `requireTenantId(c)` (dziś z nagłówka `x-tenant-id`, docelowo z tokenu). Referencje między tabelami waliduje się w obrębie Tenanta (np. przy tworzeniu `branch` sprawdzamy `companyRepository(tenantId).findById(companyId)`), więc nie da się podpiąć zasobu pod cudzą firmę.

Zalety: proste, testowalne, czytelne. Wada: łatwo zapomnieć filtra w nowym repo → dlatego jest warstwa 2.

### Warstwa 2 — Postgres Row-Level Security (RLS)

Na każdej tabeli biznesowej włączamy RLS i politykę opartą o zmienną sesji:

```sql
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON branches
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

Aplikacja na początku każdego żądania ustawia `SET app.current_tenant = '<tenantId>'` (w transakcji/połączeniu). Nawet jeśli zapytanie zgubi filtr aplikacyjny — baza i tak nie zwróci cudzych wierszy.

> **Warunek:** klient DB nie może łączyć się jako `superuser`/właściciel tabeli (te role omijają RLS). Potrzebna dedykowana rola aplikacyjna.

### Kolejność wdrożenia

1. Najpierw warstwa 1 (helper `forTenant`) — wdrażana wraz z każdym nowym modułem.
2. RLS włączamy migracją, gdy schemat tabel biznesowych się ustabilizuje (po rozbudowie `companies`/`branches`).
3. `TenantContext.tenantId` musi pochodzić z **zweryfikowanego tokenu** (patrz: Auth), a nie z surowego nagłówka `x-tenant-id`.

---

# Authentication Flow

> **Stan wdrożenia (model członkostwa):**
>
> 1. `auth` middleware weryfikuje `Authorization: Bearer <token>` i ustawia `userId` w kontekście. Brak tokenu = anonim; niepoprawny = 401.
> 2. `x-tenant-id` wybiera Tenanta, ale **nie jest zaufany sam z siebie** — guard `requireMembership` sprawdza wpis w `tenant_members` dla `(tenantId, userId)`. Brak członkostwa → 403.
> 3. Rola z `tenant_members` → uprawnienia (`core/auth/permissions.ts`); `requirePermission(c, PERM)` egzekwuje je na endpointach.
> 4. Utworzenie Tenanta wymaga tokenu; twórca dostaje członkostwo `owner` (w jednej transakcji).
>
> **Weryfikacja tokenu:** dziś HS256 z sekretem (`AUTH_JWT_SECRET`) — dev/test. Produkcyjnie (**AWS Cognito**, kierunek do potwierdzenia): podmiana `core/auth/verifier.ts` na `verifyWithJwks` (RS256, walidacja `iss`/`aud`/`exp`). Reszta aplikacji bez zmian.

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
