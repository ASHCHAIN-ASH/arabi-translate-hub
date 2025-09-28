import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAntiDevTools } from './utils/antiDevTools'

// تفعيل حماية المحتوى
initAntiDevTools();

createRoot(document.getElementById("root")!).render(<App />);
