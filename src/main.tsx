import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAntiDevTools } from './utils/antiDevTools'

// تأجيل تفعيل حماية المحتوى لتحسين الأداء
setTimeout(() => {
  initAntiDevTools();
}, 1000);

createRoot(document.getElementById("root")!).render(<App />);
