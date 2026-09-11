import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Testy silnika sa czystymi funkcjami. Testy danych korzystaja z bazy,
    // wiec nie moga chodzic rownolegle na tym samym pliku SQLite.
    fileParallelism: false,
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  // tsconfig ma jsx: "preserve", bo JSX kompiluje Next. Vitest musi dostac
  // wlasne ustawienie, zeby dalo sie testowac eksport PDF z lib/raport/pdf.tsx.
  oxc: { jsx: { runtime: "automatic" } },
});
