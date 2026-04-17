import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAntiDevTools } from './utils/antiDevTools'
import { installLatinDigitsEnforcer } from './utils/forceLatinDigits'

// فرض الأرقام اللاتينية (الإنجليزية) قبل أي تنسيق
installLatinDigitsEnforcer();

// تأجيل تفعيل حماية المحتوى لتحسين الأداء
setTimeout(() => {
  initAntiDevTools();
}, 1000);

createRoot(document.getElementById("root")!).render(<App />);
