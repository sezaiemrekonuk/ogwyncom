# OGW Marketing Studio - React Application

A modern, dynamic React.js application converted from the original HTML/CSS/JS website.

## Features

- ✅ **Modern React Architecture**: Built with React 18 and Vite
- ✅ **Responsive Design**: Mobile-first approach with responsive layouts
- ✅ **Dynamic Content**: JSON-based data structure for easy content management
- ✅ **Smooth Animations**: Intersection Observer-based scroll animations
- ✅ **Service Carousel**: Interactive carousel for showcasing services
- ✅ **React Router**: Client-side routing for seamless navigation
- ✅ **Component-Based**: Reusable components for maintainable code
- 🔄 **Firebase Ready**: Placeholder configuration for article management
- 🔄 **SEO Optimized**: Meta tags and semantic HTML structure

## Project Structure

```
react-app/
├── public/
│   ├── images/           # All images and assets
│   └── favicon.svg       # Site favicon
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components
│   ├── data/            # JSON data files
│   ├── hooks/           # Custom React hooks
│   ├── config/          # Configuration files (Firebase, etc.)
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
└── package.json
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Data Structure

The application uses JSON files for dynamic content:

- `services.json` - Service offerings and descriptions
- `articles.json` - Blog articles and newsletters  
- `partners.json` - Partner logos and information
- `broadcasts.json` - Spotify embeds and media content
- `navigation.json` - Navigation menu and footer links

## Firebase Integration

The application is prepared for Firebase integration:

1. **Setup Firebase:**
   - Create a Firebase project
   - Enable Firestore database
   - Update `src/config/firebase.js` with your credentials

2. **Article Management:**
   - Articles are currently loaded from JSON
   - Replace with Firebase queries in `src/config/firebase.js`
   - Update `src/pages/Article.jsx` to use Firebase data

## Components

### Layout Components
- `Header` - Main navigation with mobile menu
- `Footer` - Footer with newsletter signup and social links
- `MobileNav` - Mobile navigation overlay
- `Layout` - Wrapper component for consistent layout

### Feature Components
- `ServiceCarousel` - Interactive service showcase
- `PartnersMarquee` - Auto-scrolling partner logos
- `ArticleCard` - Article preview cards
- `BroadcastCard` - Spotify embed cards
- `AnimatedSection` - Scroll-triggered animations

### Pages
- `Home` - Landing page with all sections
- `Bulletin` - Article listing page
- `Broadcast` - Media and podcast showcase
- `Hub` - OGW Hub features
- `Store` - Coming soon page
- `OgwynAI` - AI services showcase
- `Contact` - Contact form
- `PrivacyPolicy` - Privacy policy
- `Article` - Individual article view
- `NotFound` - 404 error page

## Styling

The application uses the original CSS with improvements:
- CSS custom properties for consistent theming
- Mobile-first responsive design
- Smooth animations and transitions
- Modern CSS features (Grid, Flexbox, etc.)

## TODO

- [ ] Implement Firebase article fetching
- [ ] Add form submission functionality
- [ ] Implement newsletter subscription
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Implement search functionality
- [ ] Add PWA features

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router Dom** - Client-side routing
- **Lucide React** - Icon library
- **CSS3** - Styling with modern features

## Original Features Converted

All original website features have been successfully converted:
- ✅ Header with scroll effects
- ✅ Mobile navigation
- ✅ Hero section with partners marquee
- ✅ Service carousel
- ✅ Article cards and listings
- ✅ Broadcast/Spotify embeds
- ✅ Footer with newsletter signup
- ✅ All page layouts and content
- ✅ Responsive design
- ✅ Smooth animations

The React application maintains 100% feature parity with the original while adding modern development practices and improved maintainability.