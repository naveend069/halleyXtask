# HalleyX Frontend

A modern e-commerce platform built with Next.js, featuring beautiful styling with Tailwind CSS and powerful admin features.

## 🎨 Styling Features

### Tailwind CSS Integration
- **Installed and configured** Tailwind CSS with PostCSS
- **CDN fallback** included for reliable styling
- **Custom CSS variables** for consistent theming
- **Fallback utility classes** in case Tailwind doesn't load
- **Dark mode support** with theme switching

### Design System
- **Responsive design** that works on all devices
- **Modern UI components** with hover effects and transitions
- **Consistent color scheme** with CSS variables
- **Beautiful gradients** and shadows
- **Accessible design** with proper contrast ratios

## 🔐 Authentication & Authorization

### User Roles
- **Customer**: Can browse products, manage cart, view orders
- **Admin**: Full access to all features including customer management

### Admin Impersonation
- **Impersonate customers** for support purposes
- **Seamless switching** between admin and customer views
- **Clear visual indicators** when impersonating
- **Easy return** to admin mode

## 📱 Pages & Features

### Customer Pages
- **Homepage**: Beautiful landing page with feature showcase
- **Login/Register**: Secure authentication forms
- **Dashboard**: Customer dashboard with order history and stats
- **Products**: Product catalog with search and filtering

### Admin Pages
- **Admin Dashboard**: Overview with product management
- **Customer Management**: View, block, and impersonate customers
- **Order Management**: Track and manage customer orders
- **Product Management**: Add, edit, and remove products

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd halleyx-frontend
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production
```bash
npm run build
npm start
```

## 🛠️ Technical Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS + Custom CSS
- **Authentication**: JWT with role-based access
- **State Management**: React hooks and context
- **UI Components**: Custom components with Tailwind
- **Icons**: Heroicons (SVG)
- **Theme**: Dark/Light mode support

## 🎯 Key Features

### Styling Improvements
- ✅ **Fixed Tailwind CSS** - Now properly installed and configured
- ✅ **CDN fallback** - Ensures styling works even if build fails
- ✅ **Custom CSS variables** - Consistent theming across components
- ✅ **Responsive design** - Works perfectly on all screen sizes
- ✅ **Dark mode** - Toggle between light and dark themes

### Admin Features
- ✅ **Customer impersonation** - Admins can impersonate customers
- ✅ **Customer management** - View, block, and manage customers
- ✅ **Order tracking** - Monitor customer orders
- ✅ **Product management** - Full CRUD operations for products

### User Experience
- ✅ **Beautiful UI** - Modern, clean design with smooth animations
- ✅ **Loading states** - Skeleton loaders and spinners
- ✅ **Error handling** - Graceful error boundaries and toast notifications
- ✅ **Accessibility** - Proper ARIA labels and keyboard navigation

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:
- Custom color variables
- Dark mode support
- Responsive breakpoints
- Custom shadows and borders

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📁 Project Structure

```
halleyx-frontend/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── dashboard/         # Customer dashboard
│   ├── login/             # Authentication pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── ThemeSwitcher.jsx # Theme toggle
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
└── public/               # Static assets
```

## 🎨 Customization

### Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --primary-color: #32CD32;
  --primary-hover-color: #228B22;
  /* ... more variables */
}
```

### Components
All components are built with Tailwind CSS and can be easily customized by modifying the className props.

## 🚀 Deployment

The application is ready for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

## 📝 License

This project is part of the HalleyX e-commerce platform.
