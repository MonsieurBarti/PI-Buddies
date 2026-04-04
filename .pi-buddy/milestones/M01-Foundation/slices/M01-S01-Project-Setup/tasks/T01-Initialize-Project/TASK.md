# T01: Initialize Project

## Parent
[M01-S01: Project Setup](../PLAN.md)

## Goal
Create project scaffolding with TypeScript, Vitest, Biome.

## Acceptance Criteria
- [ ] `npm install` works
- [ ] `npm test` runs vitest
- [ ] `npm run build` compiles TypeScript
- [ ] `npm run check` runs biome lint+format
- [ ] `src/` has hexagonal folder structure

## Artifacts to Create

### 1. package.json
```json
{
  "name": "@pi-buddy/core",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest",
    "check": "biome check .",
    "check:fix": "biome check . --write",
    "format": "biome format . --write"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  },
  "dependencies": {
    "zod": "^3.24.0"
  }
}
```

### 2. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2024"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
});
```

### 4. biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

### 5. Directory Structure
```
src/
├── hexagons/
│   └── buddy/
│       ├── domain/
│       │   ├── ports/
│       │   │   ├── buddy-repository.port.ts
│       │   │   ├── random-provider.port.ts
│       │   │   ├── time-provider.port.ts
│       │   │   └── session-analyzer.port.ts
│       │   ├── errors/
│       │   │   └── domain.error.ts
│       │   ├── buddy.entity.ts
│       │   ├── buddy.schemas.ts
│       │   ├── rarity.value-object.ts
│       │   ├── species.value-object.ts
│       │   ├── xp.value-object.ts
│       │   ├── evolution.value-object.ts
│       │   ├── shiny.value-object.ts
│       │   ├── stats.value-object.ts
│       │   └── skills.value-object.ts
│       ├── use-cases/
│       │   ├── hatch-buddies.use-case.ts
│       │   ├── select-buddy.use-case.ts
│       │   ├── gain-xp.use-case.ts
│       │   ├── tick-passive-xp.use-case.ts
│       │   ├── check-evolution.use-case.ts
│       │   ├── use-skill.use-case.ts
│       │   └── get-buddy-status.use-case.ts
│       ├── infrastructure/
│       │   ├── fs-buddy-repository.adapter.ts
│       │   ├── math-random-provider.adapter.ts
│       │   ├── system-time-provider.adapter.ts
│       │   └── gsd-session-analyzer.adapter.ts
│       └── index.ts
├── test/
│   └── setup.ts
└── index.ts
```

## Branch
`feature/M01-S01-T01-init-project`

## Notes
- Use NodeNext module resolution for ESM
- Strict TypeScript required
- Zod for runtime validation (schemas.ts)

---

*Task created: 2025-04-04*
