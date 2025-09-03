# SkyAI Agriculture Dashboard

A comprehensive AIoT (Artificial Intelligence of Things) dashboard for agriculture management with real-time monitoring of pH levels and soil moisture.

## Features

- **pH Level Monitoring**: Real-time pH monitoring across multiple zones with optimal range indicators
- **Soil Moisture Tracking**: Comprehensive soil moisture monitoring with zone-specific readings
- **Plant Health Overview**: Track plant health statistics across your agricultural zones
- **Responsive Design**: Tesla-inspired design with clean, modern interface
- **Real-time Data**: Live monitoring of environmental conditions

## Technologies Used

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd skyai-aiot-mockup
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Deployment to Netlify

### Option 1: Deploy via Git (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Netlify](https://netlify.com) and sign up/login
3. Click "New site from Git"
4. Choose your Git provider and repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`
6. Click "Deploy site"

### Option 2: Manual Deployment

1. Build the project locally:
```bash
npm run build
```

2. Go to [Netlify](https://netlify.com) and login
3. Drag and drop the `dist` folder to the deploy area

### Environment Configuration

The project includes:
- `netlify.toml` - Netlify configuration file
- `_redirects` - SPA routing configuration
- Optimized build settings for production

## Dashboard Features

### pH Level Monitoring
- Zone-specific pH readings
- Optimal range indicators (6.0-7.0)
- Color-coded status (green = optimal, yellow/red = warning)
- Progress bars for visual representation

### Soil Moisture Tracking
- Real-time moisture percentages by zone
- Optimal range monitoring (60%-80%)
- Average moisture calculation
- Last updated timestamps

### Plant Health Overview
- Total plant count
- Health status breakdown (Healthy, Warning, Critical)
- Visual status indicators

## Color Scheme

- **Primary**: #252617 (Dark green)
- **Secondary**: #FFFFFF (White)
- **Success**: #00FF00 (Bright green)
- **Warning**: #FF0000 (Red)
- **Background**: #F8F8F8 (Light gray)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary to SkyAI.

---

**SkyAI Agriculture Dashboard** - Advanced AIoT monitoring for modern agriculture