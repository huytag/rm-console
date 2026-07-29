# CLAUDE.md (rm-console)

This file provides strict architectural and coding guidelines for Claude Code (claude.ai/code) when working on the Vue 3 Frontend repository.

## Project Overview
Admin dashboard for a Rental Management System.
Target Users: System Admins & Property Managers.
Language: Vietnamese UI.

## Tech Stack & Standards
- **Framework:** Vue 3 (Composition API strictly with `<script setup>`).
- **UI Library:** Element Plus. Use standard components (`el-table`, `el-dialog`, `el-form`).
- **State Management:** Pinia (Store definitions should be modular).
- **Routing:** Vue Router. All routes must be protected by auth guards.
- **HTTP Client:** Axios. (Base URL: `/api`).
    - Standard Response Format: `{ status, message, error_code, data }`.
    - ALWAYS extract the `data` payload from the response object.

## Core Modules & Views (Must match Backend API)
The UI must provide CRUD operations and management screens for:
1. **Building & Room:** Buildings (Cơ sở) 1-N Rooms. Rooms have statuses (Available, Rented, Reserved, Maintenance).
2. **Assets:** Managed within the Room detail context.
3. **Contracts:** Need UI for Admin to review and "Digitally Sign" (Approve) contracts.
4. **Invoices & Utilities:** UI to input utility indices (Điện/Nước) and generate monthly invoices.
5. **Financial Entries:** Ledger for manual Income/Expense entry.
6. **Maintenance Requests:** Kanban or Table view for tenant issues.
7. **System Config:** Form to update global prices (Electricity, Water).
8. **Audit Log & Job Log:** Read-only data tables with pagination.

## UI/UX Rules
- **Form Validation:** ALL forms (Create/Update) must use Element Plus form validation rules before submitting to Axios.
- **Error Handling:** Use `ElMessage.error` to catch and display backend API errors gracefully.
- **Loading States:** Use `v-loading` on tables and submit buttons (`loading` prop) to prevent double-clicks/duplicate submissions.
- **Formatting:** Dates must be formatted as `DD/MM/YYYY`. Currency must be formatted as VND (e.g., `1,000,000 ₫`).