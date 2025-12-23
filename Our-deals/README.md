# Our Deals - Business Directory Platform

A modern, responsive business directory platform built with React that helps users discover and connect with verified businesses across India. Find the best services, deals, and vendors in your city.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![React Router](https://img.shields.io/badge/React_Router-7.9.6-red)

## 🌟 Features

### Core Functionality
- **Homepage** with category grid, popular searches, and promotional banners
- **Categories Page** with sidebar navigation and subcategory grid
- **Vendor Listing** with filtering options (All, Near by, Available, Top-rated)
- **Vendor Detail Page** with comprehensive business information
- **User Profile** with edit functionality
- **Login System** with OTP verification
- **Contact Us** page
- **Privacy Policy** page

### Design Features
- **Fully Responsive** - Works seamlessly on all screen sizes (mobile, tablet, desktop)
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Category Sections** - Popular searches and regular category sections
- **Search Functionality** - Quick search for businesses and services
- **Bottom Navigation** - Easy mobile navigation
- **Language Support** - English and Hindi language options

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd our-deals-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

```
our-deals-project/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media files
│   ├── components/       # Reusable React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── CategoryGrid.jsx
│   │   ├── CategorySections.jsx
│   │   ├── LoginModal.jsx
│   │   ├── OTPModal.jsx
│   │   └── ...
│   ├── data/             # Data files
│   │   ├── categories.js
│   │   ├── categoryNames.js
│   │   └── categorySections.js
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── VendorListPage.jsx
│   │   ├── VendorDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── ...
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Main homepage with categories and sections |
| `/categories` | CategoriesPage | Browse all categories |
| `/categories/:categoryName` | CategoriesPage | View subcategories for a category |
| `/vendors/:subcategoryName` | VendorListPage | List of vendors in a subcategory |
| `/vendor/:vendorId` | VendorDetailPage | Detailed vendor information |
| `/profile` | ProfilePage | User profile page |
| `/contact-us` | ContactUsPage | Contact information |
| `/privacy-policy` | PrivacyPolicyPage | Privacy policy page |

## 🎨 Key Components

### Header
- Logo and navigation
- Location selector
- Login button
- Profile icon

### CategoryGrid
- Main category display on homepage
- Circular category icons
- "See More" option

### CategorySections
- Popular Searches section
- Regular category sections (Wedding Requisites, Beauty & Spa, etc.)
- Responsive 4-card layout

### LoginModal
- Mobile number input
- OTP verification flow
- Terms and conditions

### VendorListPage
- Filter buttons (All, Near by, Available, Top-rated)
- Vendor cards with details
- Call, Chat, Direction actions

### VendorDetailPage
- Comprehensive vendor information
- Tabs (Overview, Reviews, Quick Info)
- Action buttons (Call, Chat)

## 🎯 Responsive Design

The entire application is fully responsive with:
- **Mobile-first approach**
- **Fluid typography** using `clamp()` function
- **Flexible layouts** with CSS Grid and Flexbox
- **Media queries** for different breakpoints (768px, 480px, 400px)

## 🔧 Customization

### Adding New Categories
Edit `src/data/categories.js` or `src/data/categorySections.js` to add new categories.

### Modifying Colors
The main brand colors are:
- Primary: `#13335a` (Dark Blue)
- Secondary: `#1e4a7a` (Medium Blue)
- Accent: `#3b82f6` (Light Blue)

Update these in component CSS files as needed.

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation if needed

## 📦 Dependencies

### Core
- **react** ^19.2.0 - UI library
- **react-dom** ^19.2.0 - React DOM renderer
- **react-router-dom** ^7.9.6 - Routing

### Development
- **vite** ^7.2.4 - Build tool
- **eslint** - Code linting

## 🚀 Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- All contributors and testers

## 📞 Support

For support, email support@ourdeals.com or visit our [Contact Us](/contact-us) page.

---

**Made with ❤️ for connecting businesses and customers**
