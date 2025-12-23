# Quick Start Guide - Our Deals

Get up and running with Our Deals in minutes!

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Node.js
Make sure you have Node.js installed (version 16 or higher).

Check your version:
```bash
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Clone or Download the Project
```bash
git clone <your-repo-url>
cd our-deals-project
```

Or download and extract the ZIP file, then navigate to the folder.

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages (React, React Router, Vite, etc.)

### Step 4: Start Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser
Open your browser and go to: **http://localhost:5173**

🎉 **You're all set!** The website should now be running.

## 📱 Testing on Mobile

### Option 1: Use Browser DevTools
1. Open Chrome/Firefox DevTools (F12)
2. Click the device toggle icon
3. Select a mobile device or set custom dimensions

### Option 2: Access from Mobile Device
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`
2. Start dev server with network access:
   ```bash
   npm run dev -- --host
   ```
3. On your mobile device, open: `http://YOUR_IP:5173`

## 🏗️ Building for Production

### Create Production Build
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Deploy
Upload the contents of the `dist/` folder to your web hosting service:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Use GitHub Actions
- **Traditional Hosting**: Upload via FTP

## 🔍 Common Issues & Solutions

### Issue: Port already in use
**Solution**: Kill the process using port 5173 or use a different port:
```bash
npm run dev -- --port 3000
```

### Issue: Module not found errors
**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails
**Solution**: Clear cache and rebuild:
```bash
rm -rf dist node_modules/.vite
npm run build
```

## 📂 Key Files to Know

- **`src/App.jsx`** - Main app with routing
- **`src/pages/HomePage.jsx`** - Homepage component
- **`src/data/categories.js`** - Category data
- **`package.json`** - Dependencies and scripts
- **`vite.config.js`** - Build configuration

## 🎯 Next Steps

1. **Customize Content**: Edit data files in `src/data/`
2. **Modify Styles**: Update CSS files in `src/components/` and `src/pages/`
3. **Add Features**: Create new components in `src/components/`
4. **Deploy**: Build and deploy to your hosting service

## 💡 Tips

- **Hot Reload**: Changes automatically refresh in browser
- **Console**: Check browser console (F12) for errors
- **Responsive**: Test on different screen sizes
- **Performance**: Use production build for best performance

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review component files for implementation details
- Check browser console for error messages

---

**Happy Coding! 🚀**

