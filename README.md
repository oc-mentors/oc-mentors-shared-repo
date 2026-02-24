# OC Mentors Project

A comprehensive mentoring platform connecting students with tutors, featuring Canvas LMS integration, real-time messaging, and progress tracking.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd "OC Mentors Project - Final (Copy) (Copy)"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── App.tsx         # Main app component
│   └── imports/            # SVG imports
├── public/                 # Static assets
├── package.json
└── vite.config.ts
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production

### Environment Variables

For **Firebase** (optional backend):

1. Copy `.env.example` to `.env`
2. Add your Firebase config from [Firebase Console](https://console.firebase.google.com/) → Project settings → Your apps
3. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for full setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Notes

- This is currently a frontend-only application
- Backend API integration is planned (see `BACKEND_REQUIREMENTS.md`)

## 📚 Documentation

- [Backend Requirements](./BACKEND_REQUIREMENTS.md) - Complete backend API specification
- [Firebase Beginner Guide](./FIREBASE_BEGINNER_GUIDE.md) - **Start here:** What Firebase is, what was added, and step-by-step setup
- [Firebase Setup](./FIREBASE_SETUP.md) - Technical reference (Auth, Firestore, Storage, rules)

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

[Add your license here]

## 👥 Team

[Add team members here]
