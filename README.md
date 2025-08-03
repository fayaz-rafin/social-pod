# 🥦 SocialPod - AI-Powered Grocery Planning App

**A Next.js 15 social grocery planning application with AI integration, gamification, and real-time collaboration features.**

![SocialPod Banner](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.50.2-3ECF8E?style=for-the-badge&logo=supabase)

## 🚀 Live Demo

**[Demo Link Coming Soon]**

## 📱 Features

### 🤖 AI-Powered Grocery Planning
- **Intelligent Meal Suggestions**: Powered by Groq AI (Llama3-8b-8192 model)
- **Budget-Aware Recommendations**: Dynamic ingredient selection based on budget constraints
- **Personalized Nutrition Goals**: Custom meal plans for bulking, weight loss, healthy eating
- **Smart Category Classification**: Automatic categorization (Protein, Vegetable, Grain, Dairy, etc.)

### 🎮 Gamification System
- **Points System**: Earn points for completing grocery plans and achieving goals
- **Trophy Achievements**: Unlock trophies for nutrition, shopping, and budget goals
- **Progress Tracking**: Visual progress bars and goal completion status
- **Leaderboards**: Social competition with friends and family

### 🛒 Advanced Shopping Features
- **Real-time Product Search**: Integration with Open Food Facts API
- **Nutritional Information**: Detailed nutritional data for informed choices
- **Budget Management**: Smart budget allocation and savings tracking
- **Shopping History**: Complete history of past grocery trips
- **Group Shopping**: Collaborative grocery planning with friends

### 📊 Analytics Dashboard
- **Spending Analytics**: Monthly and total spending breakdown
- **Goal Progress**: Visual representation of nutrition and shopping goals
- **Meal Suggestions**: Weekly meal recommendations based on purchased ingredients
- **Personal Statistics**: Points earned, goals completed, shopping patterns

### 🔐 Authentication & Security
- **Supabase Authentication**: Secure user registration and login
- **Session Management**: Persistent user sessions across devices
- **Data Privacy**: User data protection and secure storage
- **Real-time Sync**: Instant data synchronization across devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS framework
- **React 19** - Latest React with concurrent features
- **Rive Animations** - Interactive animations and mascot

### Backend & APIs
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Groq AI** - High-performance AI inference
- **Open Food Facts API** - Nutritional database integration
- **Next.js API Routes** - Serverless API endpoints

### Development Tools
- **Turbopack** - Fast development bundler
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **PWA Support** - Progressive Web App capabilities

## 🏗️ Architecture

### Project Structure
```
socialpod/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable components
│   ├── data/             # Data layer and types
│   ├── dashboard/        # Analytics dashboard
│   ├── brocoli/          # AI planning interface
│   └── plan/             # Shopping list management
├── public/               # Static assets
└── package.json          # Dependencies
```

### Key Components

#### AI Planning Engine (`/api/generate-plan`)
- **Groq AI Integration**: Real-time meal planning with Llama3-8b-8192
- **Budget Optimization**: Smart ingredient selection based on budget
- **Goal-Based Planning**: Personalized recommendations for fitness goals
- **Error Handling**: Robust fallback mechanisms for API failures

#### Interactive UI (`/brocoli`)
- **Rive Animations**: Engaging mascot animations
- **Real-time Updates**: Live budget and plan updates
- **Responsive Design**: Mobile-first design approach
- **Accessibility**: ARIA labels and keyboard navigation

#### Data Management (`/data/dataStore.ts`)
- **TypeScript Interfaces**: Strongly typed data structures
- **Supabase Integration**: Real-time database operations
- **Local Storage**: Offline capability and caching
- **Error Handling**: Comprehensive error management

## 🎯 Key Technical Achievements

### 1. AI Integration Excellence
- **Custom Prompt Engineering**: Sophisticated prompts for Groq AI
- **JSON Response Parsing**: Robust handling of AI-generated content
- **Fallback Mechanisms**: Graceful degradation when AI fails
- **Context-Aware Planning**: Dynamic meal suggestions based on user goals

### 2. Performance Optimization
- **Turbopack Integration**: Lightning-fast development builds
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Component-level code splitting
- **Caching Strategies**: Intelligent data caching and persistence

### 3. User Experience Design
- **Mobile-First Design**: Optimized for mobile devices
- **Progressive Enhancement**: Core functionality without JavaScript
- **Accessibility Compliance**: WCAG guidelines adherence
- **Smooth Animations**: 60fps animations and transitions

### 4. Data Architecture
- **TypeScript Types**: Comprehensive type definitions
- **Real-time Sync**: Supabase real-time subscriptions
- **Offline Support**: Local storage for offline functionality
- **Data Validation**: Input validation and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Groq API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/socialpod.git
cd socialpod
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

4. **Run development server**
```bash
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Core Tables
- **users**: User authentication and profile data
- **grocery_history**: Shopping plan history and analytics
- **user_goals**: Personal nutrition and shopping goals
- **item_table**: Product catalog and nutritional data

## 🎨 Design System

### Color Palette
- **Primary**: `#FDE500` (Yellow)
- **Secondary**: `#000000` (Black)
- **Background**: `#FFFFFF` (White)
- **Accent**: `#EDDF5E` (Light Yellow)

### Typography
- **Headings**: Helvetica Bold (custom font)
- **Body**: System fonts with fallbacks
- **Weights**: Black (900), Bold (700), Semibold (600)

### Components
- **Cards**: Rounded corners with shadows
- **Buttons**: Full-width with hover effects
- **Inputs**: Clean borders with focus states
- **Navigation**: Bottom tab bar with active states

## 🔧 API Endpoints

### `/api/generate-plan`
- **Method**: POST
- **Purpose**: Generate AI-powered grocery plans
- **Input**: `{ prompt: string, budget: number }`
- **Output**: Structured grocery plan with ingredients and tips

### `/api/add-to-nofrills-cart`
- **Method**: POST
- **Purpose**: Integration with No Frills shopping cart
- **Input**: Grocery list items
- **Output**: Cart confirmation

## 🧪 Testing

```bash
# Run linting
pnpm lint

# Type checking
pnpm type-check

# Build for production
pnpm build
```

## 📱 PWA Features

- **Offline Support**: Core functionality without internet
- **Install Prompt**: Native app-like installation
- **Push Notifications**: Goal reminders and updates
- **App Manifest**: Custom icons and branding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**by no idea®** - A hackathon project by:
- **Menghao** - Backend & AI Integration
- **Ayman** - Frontend & UI/UX
- **Fayaz** - Full-Stack Development
- **Suzanna** - Product Design & UX

## 🏆 Awards & Recognition

- **Hackathon Winner** - Best AI Integration
- **Innovation Award** - Most Creative Use of APIs
- **User Experience Award** - Best Mobile-First Design

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**

*"Shopping made fun" - SocialPod*
