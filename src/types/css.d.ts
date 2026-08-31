// next's own types (node_modules/next/types/global.d.ts) declare '*.module.css'
// but not a plain '*.css'. a side-effect import like `import './globals.css'`
// therefore has no declaration, which newer typescript versions report as
// TS2882. tailwind's entrypoint is exactly such an import, so declare it here.
declare module '*.css'
