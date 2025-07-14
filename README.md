# Allowance Tracker

A modern, mobile-first web application to track children's allowances, manage weekly payouts, and track deductions for misbehavior.

## Features

- 📱 Mobile-first responsive design
- 👨‍👩‍👧‍👦 Manage multiple children's allowances
- 💰 Set custom weekly allowance amounts
- ⏱️ Automatic weekly allowance calculation
- ➖ Track deductions for misbehavior
- 💾 Local storage for data persistence
- 🎨 Clean, modern UI built with Material-UI (MUI) v7

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/allowance-tracker.git
   cd allowance-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Usage

1. **Add a Child**
   - Click the "Add Child" button
   - Enter the child's name and weekly allowance
   - Optionally set an initial balance

2. **View Dashboard**
   - See all children's current balances
   - View weekly allowance amounts
   - Track total deductions

3. **Update Allowance**
   - Click the edit (pencil) icon on a child's card
   - Update the weekly allowance amount
   - Save changes

4. **Add Deduction**
   - Click the money icon on a child's card
   - Enter the deduction amount and reason
   - The amount will be subtracted from the child's balance

5. **Process Weekly Allowance**
   - Click the refresh icon in the "Total Balance" card
   - This will add each child's weekly allowance to their balance

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **Styling**: MUI's styled system and `sx` prop
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Yup validation
- **Routing**: React Router v5
- **Build Tool**: Vite
- **Icons**: MUI Icons
- **Date Handling**: date-fns

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Material Icons](https://mui.com/components/material-icons/)
- [React Icons](https://react-icons.github.io/react-icons/)
