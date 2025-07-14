# Allowance Tracker - Deployment Guide

This guide provides instructions for deploying the Allowance Tracker application to production.

## Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later
- Git

## Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd allowance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.production` (if it exists) or create a new `.env.production` file
   - Update the environment variables as needed for your production environment

## Building for Production

1. Run the production build:
   ```bash
   npm run build:prod
   ```
   This will:
   - Clean the `dist` directory
   - Build the application in production mode
   - Generate optimized assets
   - Create a production-ready build in the `dist` directory

2. (Optional) Preview the production build locally:
   ```bash
   npm run preview:prod
   ```
   This will start a local server to preview the production build.

## Deployment Options

### Static Hosting (e.g., Vercel, Netlify, GitHub Pages)

1. Configure your static file host to serve files from the `dist` directory
2. Set up the following build command:
   ```
   npm run build:prod
   ```
3. Set the publish directory to `dist`
4. Configure any necessary environment variables in your hosting provider's settings

### Self-Hosted Server (e.g., Nginx, Apache)

1. Build the application:
   ```bash
   npm run build:prod
   ```

2. Configure your web server to serve the `dist` directory

   **Nginx Example:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/allowance-tracker/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   **Apache Example:**
   ```apache
   <VirtualHost *:80>
       ServerName your-domain.com
       DocumentRoot /path/to/allowance-tracker/dist

       <Directory "/path/to/allowance-tracker/dist">
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>

       ErrorLog ${APACHE_LOG_DIR}/error.log
       CustomLog ${APACHE_LOG_DIR}/access.log combined
   </VirtualHost>
   ```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Base URL for API requests | `/api` | No |
| `VITE_APP_ENV` | Application environment | `production` | No |
| `VITE_APP_NAME` | Application name | `Allowance Tracker` | No |

## Post-Deployment

1. **Verify the deployment** by visiting your application's URL
2. **Check the browser console** for any errors
3. **Test all major functionality** to ensure everything works as expected
4. **Set up monitoring** (e.g., error tracking, analytics) if desired

## Troubleshooting

- **Blank page on refresh**: Ensure your server is configured to serve `index.html` for all routes (see above examples)
- **Missing assets**: Check that the build completed successfully and all files were copied to the `dist` directory
- **Environment variables not working**: Make sure they are properly set in your hosting environment

## Updating the Application

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild the application:
   ```bash
   npm run build:prod
   ```

3. Restart your web server if necessary
