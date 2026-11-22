# CargoFlow – Smart Shipping & Container Management Platform

## Project Overview

CargoFlow is a web-based shipping and container management platform designed to simplify shipment booking, tracking, transportation management and container administration.

The platform provides separate customer and administrator experiences. Customers can book shipments, monitor shipment progress and receive notifications, while administrators can manage shipments, containers, customers and transportation operations from a centralized dashboard.

## Key Features

Customer Features

Customer registration and authentication.

Customer dashboard.

Shipment booking.

Personal shipment history.

Shipment tracking using tracking numbers.

Shipment status monitoring.

Notifications and notification management.

Administrator Features

Administrator dashboard.

Shipment management, including searching, updating statuses and deleting shipments.

Container management, including adding, editing and removing containers.

Customer management and shipment history viewing.

Transportation management.

Shipment-status notification generation.

## Security Features

Supabase authentication.

Role-based access control.

Protected customer and administrator routes.

Supabase Row Level Security (RLS).

Database policies restricting access to authorized records.

## Technologies Used

Technology

Purpose

React

Frontend application

JavaScript

Application logic

Tailwind CSS

Responsive styling

Supabase

Backend, database and authentication

PostgreSQL

Relational database

React Router

Application navigation and protected routes

Lucide React

Interface icons

Vite

Development server and build tool

Vitest

Automated testing

React Testing Library

Component testing

Git and GitHub

Version control

GitHub Actions

Continuous integration

Vercel

## Application deployment

System Architecture

CargoFlow follows a frontend-and-backend architecture.

Frontend: React provides the customer and administrator interfaces.

Backend: Supabase provides authentication, database services and access control.

Database: PostgreSQL stores user profiles, shipments, containers, transportation records and notifications.

Deployment: Vercel hosts the production application.

Testing and CI: Vitest and GitHub Actions support automated testing and build verification.

## Database Structure

The application uses the following main database tables:

profiles – Stores customer and administrator profile information.

shipments – Stores shipment bookings and shipment details.

containers – Stores container information and availability.

transportation – Stores shipment transportation records.

notifications – Stores customer notifications.

## Getting Started

### Prerequisites

Make sure you have the following installed:

Node.js

npm

Git

A Supabase account

1. Clone the repository

git clone [https://github.com/okumujphh-netizen/CARGOFLOW.git]

2. Navigate into the project

[cd CARGOFLOW]

3. Install dependencies

[npm install]

4. Configure environment variables

Create a .env file in the project root.

Add your Supabase project credentials:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Obtain these values from your Supabase project settings.

Important: Never commit private credentials or service-role keys to GitHub.

5. Start the development server

npm run dev

Open the local URL displayed in your terminal.

## Testing

CargoFlow uses Vitest and React Testing Library for automated component testing.

{Run the test suite:}

{npm run test:run}

{Run the production build:}

{npm run build}

The current automated test suite contains 55 passing tests across 8 test files.

## Deployment

CargoFlow is deployed using Vercel and connected to its GitHub repository.

Production deployments are triggered from the main branch.

The project also uses GitHub Actions to run automated tests and production builds when changes are pushed or pull requests are created.

## Project Links

Live Application: [https://cargoflow-htnh7mvl4-jp-8ebe.vercel.app/]

GitHub Repository: [https://github.com/okumujphh-netizen/CARGOFLOW]

Figma Design: [https://www.figma.com/make/P8AOjdLHwU8F2L5llK0lsi/CargoFlow-Shipping-Platform?t=ab0FgE1hFCLDVjq7-0]


supabase : [https://supabase.com/dashboard/project/iuqqnemhkaqvvixwsuvi]

## Future Improvements

Potential future enhancements include:

1.Real-time shipment location tracking.

2.Integration with shipping and logistics providers.

3.Email and SMS notifications.

4.Advanced shipment analytics and reporting.

5.Expanded automated testing.

6.Improved operational reporting for administrators.

## Conclusion

CargoFlow demonstrates how modern web technologies can be combined to build a centralized shipping and container management solution.

The platform brings customer shipment services and administrative logistics operations together through a responsive, secure and role-based web application.

Developed as a Software Engineering project at Moringa School.