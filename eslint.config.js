import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "server"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // منع أي اعتماد مباشر على مزوّد قاعدة البيانات خارج طبقة البيانات
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/data/**", "src/integrations/**", "src/test/**", "src/**/__tests__/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/integrations/supabase/client",
              message:
                "لا تستورد عميل قاعدة البيانات مباشرة. استخدم `db` أو المستودعات من '@/data'.",
            },
            {
              name: "@supabase/supabase-js",
              message: "الاعتماد على مزوّد محدد ممنوع خارج src/data — استخدم أنواع '@/data'.",
            },
          ],
        },
      ],
    },
  }
);

