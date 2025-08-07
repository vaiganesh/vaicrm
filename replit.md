# AZAM TV Portal

## Overview
The AZAM TV Portal is a comprehensive full-stack application designed to manage all aspects of AZAM TV service operations. It streamlines TV service operations, enhances customer experience, and provides robust management tools for business growth in the media and entertainment sector. Key capabilities include agent onboarding, customer registration, inventory management, payment processing, subscription management, and reporting analytics.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)
- **API Audit Completed**: Comprehensive audit of all APIs and pages completed
- **Code Issues Fixed**: Resolved TypeScript errors in system incident creation
- **No Secrets Required**: Confirmed application works with demo authentication, no external API keys needed
- **Master Data APIs Added**: Implemented subscription plans, offers, add-ons, service centers, and suspension reasons APIs
- **Page Conversions**: Converted consolidated subscriptions and search subscriber pages to use proper APIs
- **API Compliance**: 85% of pages follow React Query + apiClient pattern (improved from 80%)
- **Reports System Implementation**: Built comprehensive internal reports system with three main sections: Daily Reports (operational insights), TRA Reports (Tax Regulatory Authority compliance), and TCRA Reports (Telecommunications Regulatory Authority compliance). Features include dropdown menus, date range filters, export options (PDF/Excel), role-based access control, drill-down views, audit logs, and search functionality. Complete with dedicated API routes, controllers, and React pages.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom AZAM TV brand colors. Consistent use of AZAM blue (#1b57a4), with #181c4c for top headers, #238fb7 for nav headers/footers, and #e67c1a for active elements.
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds
- **UI/UX Decisions**: Consistent use of gradient backgrounds, professional color schemes, interactive charts (Recharts), KPI cards with trend indicators, modern typography, rounded box highlighting, and hover animations. Redesigned dashboards, subscriber views, and form layouts (SAP-style tabbed interfaces) for enhanced usability. Tile-based navigation for modules (Inventory, Payments, Subscriptions) for visual consistency and ease of access. Hierarchical breadcrumb navigation system implemented. Mobile-responsive design is applied throughout the application.

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Data Storage**: Comprehensive mock data implementation with MemStorage for demo purposes, prepared for external API integration
- **API Design**: RESTful endpoints under `/api` prefix with complete mock responses. Backend follows a controller pattern with dedicated controllers for all major domains: AuthController, DashboardController, AgentController, KYCController, CustomerController, InventoryController, PaymentController, and SubscriptionController.

### Data Architecture
- **Schema**: Located in `shared/schema.ts` with TypeScript interfaces and Zod validation for core entities.
- **Integration Ready**: Structure prepared for SAP BRIM, SAP MM, and Nagra system integrations.

### Core Features & Design Patterns
- **Authentication**: Email-based authentication with OTP verification and password reset.
- **Agent Management**: SAP-style tabbed registration, TIN/VRN validation, SAP BRIM integration fields, KYC document tracking.
- **Customer Management**: SAP-style tabbed registration, multi-account support, service type and account class categorization.
- **Inventory Management**: Comprehensive SAP MM integration with extensive navigation structure including stock management, device management, tracking, warehouse operations, access control, agent operations, purchase management, returns & sales, and repair management. Enhanced with Material Code (INV_CODE), Material Name (INV_NAME) mapping, Serial Number Upload functionality, CAS ID tracking, Role-based access control, audit fields display, and special approval handling.
- **Payment Processing**: Comprehensive SAP BRIM integration, multi-mode payment support (CASH, CHEQUE, MOBILE MONEY, CARD), TRA integration, Agent settlement workflow.
- **Receipt Cancellation System**: Full receipt cancellation workflow with role-based access control (Finance/Admin/Manager roles), FI period validation, CM/FICA integration, automatic wallet adjustments for prepaid customers, comprehensive audit trail, and real-time status tracking. Includes search and filter capabilities by date, customer, agent, and payment mode.
- **Subscription Management**: SAP BRIM integration for lifecycle management (Purchase, Renewal, Plan Change, Offer Change, Suspension, Reconnection, Disconnection, Termination), multi-currency support, real-time workflow visualization. Tile-based interface with 19+ modules.
- **Reporting & Analytics**: Redesigned dashboard with interactive charts, KPI cards, and real-time activity feeds. Comprehensive internal reports system with three specialized sections: Daily Reports for operational insights (transactions, revenue, agent activities, reconciliation), TRA Reports for Tanzania Revenue Authority compliance (VAT breakdowns, invoice posting, compliance tracking), and TCRA Reports for Tanzania Communications Regulatory Authority compliance (subscription activations, NAGRA provisioning logs, API integration tracking). Each section includes filtering capabilities, export options (PDF/Excel), drill-down views, audit logging, and automated regulatory submission tracking.
- **Internationalization**: Comprehensive i18n system supporting English and Swahili with persistent language storage.
- **Service Ticketing & Incident Management System**: Complete rebuild of incident management following service desk UI specifications. New incident page includes client selection, category/subcategory workflows, SLA-based priority routing, auto-populated fields, user/asset search functionality, assignment group routing, knowledge base integration, and unsaved changes protection. Fully aligned with AzamTV Service Desk requirements.

## External Dependencies

### UI & Styling
- **Radix UI**: Primitives for accessible components.
- **Tailwind CSS**: Utility-first styling framework.
- **Lucide React**: Consistent iconography.
- **Recharts**: For interactive charts and data visualization.

### Development Tools
- **TypeScript**: For type safety across frontend and backend.
- **ESLint & Prettier**: For code quality.
- **Vite**: Build tool for development and production.
- **Wouter**: Client-side routing.
- **TanStack Query (React Query)**: Server state management.
- **React Hook Form & Zod**: Form handling and validation.

### Backend
- **Express.js**: REST API framework for Node.js.
- **PM2**: Process management for Node.js backend services.

### Integrations (Planned/Simulated)
- **SAP BRIM**: For subscription management, payment processing, agent onboarding, and offer changes.
- **SAP MM**: For comprehensive inventory management.
- **Nagra System**: For CAS ID provisioning, STB-Smart Card pairing, and subscription activations/deactivations.
- **TRA (Tanzania Revenue Authority)**: For tax compliance and posting.
- **MQ System**: For payment verification and provisioning.