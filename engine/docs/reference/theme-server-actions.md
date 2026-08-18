# Reference: Theme Server Actions

Provenance: provided **in full** in
`../../sources/planning-conversation-2026-08.md` (2026-08-12), accepted by
Kemi ("Yes"). Preserved verbatim here as implementation reference for
Build Order Phase 10. Not yet implemented — there is no app codebase yet.

Note the `muted` OPEN QUESTION in `../PRODUCT_SPEC.md` before seeding any
theme.

## `lib/themes/schema.ts`

```typescript
import { z } from 'zod'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be 6-digit hex like #1a1a1a')

const systemFont = z.enum([
  'Helvetica Neue', 'Arial', 'sans-serif',
  'Georgia', 'Times New Roman', 'serif',
  'Courier Prime', 'Courier New', 'monospace'
])

export const ThemeTokensSchema = z.object({
  colors: z.object({
    paper: hexColor,
    ink: hexColor,
    line: hexColor,
    muted: hexColor,
  }),
  fonts: z.object({
    ui: systemFont,
    headline: systemFont,
    meta: systemFont,
  })
})

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>

// WCAG contrast formula. Native JS, no lib.
function luminance(hex: string): number {
  const rgb = hex.match(/\w\w/g)!.map(x => parseInt(x, 16) / 255)
  const [r, g, b] = rgb.map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function validateThemeContrast(tokens: ThemeTokens): string[] {
  const errors: string[] = []
  const { paper, ink, muted } = tokens.colors

  const inkContrast = contrastRatio(paper, ink)
  if (inkContrast < 4.5) {
    errors.push(`ink on paper: ${inkContrast.toFixed(2)}:1. Must be ≥ 4.5:1 for WCAG AA`)
  }

  const mutedContrast = contrastRatio(paper, muted)
  if (mutedContrast < 4.5) {
    errors.push(`muted on paper: ${mutedContrast.toFixed(2)}:1. Must be ≥ 4.5:1 for WCAG AA`)
  }

  return errors
}
```

## `app/settings/themes/actions.ts`

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { themes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { ThemeTokensSchema, validateThemeContrast } from '@/lib/themes/schema'
import { requireAdmin } from '@/lib/auth'

type ActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

export async function updateTheme(
  themeId: string,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAdmin() // throws if not admin

  const raw = {
    name: formData.get('name'),
    colors: {
      paper: formData.get('colors.paper'),
      ink: formData.get('colors.ink'),
      line: formData.get('colors.line'),
      muted: formData.get('colors.muted'),
    },
    fonts: {
      ui: formData.get('fonts.ui'),
      headline: formData.get('fonts.headline'),
      meta: formData.get('fonts.meta'),
    }
  }

  // 1. Validate name
  if (!raw.name || typeof raw.name !== 'string' || raw.name.length < 3) {
    return { fieldErrors: { name: 'Name must be at least 3 characters' } }
  }

  // 2. Validate tokens shape
  const parsed = ThemeTokensSchema.safeParse({ colors: raw.colors, fonts: raw.fonts })
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    parsed.error.issues.forEach(i => {
      fieldErrors[i.path.join('.')] = i.message
    })
    return { fieldErrors }
  }

  // 3. Validate contrast - hard gate per addendum
  const contrastErrors = validateThemeContrast(parsed.data)
  if (contrastErrors.length > 0) {
    return { error: `Contrast failure: ${contrastErrors.join('; ')}` }
  }

  // 4. Check theme exists and is not default
  const existing = await db.query.themes.findFirst({
    where: eq(themes.id, themeId)
  })
  if (!existing) return { error: 'Theme not found' }
  if (existing.is_default) return { error: 'Cannot edit default theme. Clone it first.' }

  // 5. Update
  await db.update(themes)
    .set({
      name: raw.name as string,
      tokens_json: parsed.data,
      updated_at: new Date(),
    })
    .where(eq(themes.id, themeId))

  // 6. Revalidate everything. Theme touches public + editorial.
  revalidatePath('/', 'layout')

  // 7. Audit log per security section
  await db.insert(activityLog).values({
    user_id: user.id,
    action: 'theme.update',
    entity_type: 'theme',
    entity_id: themeId,
    metadata: { name: raw.name }
  })

  return { success: true }
}

export async function activateTheme(themeId: string): Promise<ActionState> {
  const user = await requireAdmin()

  const theme = await db.query.themes.findFirst({
    where: eq(themes.id, themeId)
  })
  if (!theme) return { error: 'Theme not found' }

  // Re-validate contrast on activate. Prevents activating a bad theme via DB.
  const tokens = ThemeTokensSchema.parse(theme.tokens_json)
  const contrastErrors = validateThemeContrast(tokens)
  if (contrastErrors.length > 0) {
    return { error: `Cannot activate. Contrast failure: ${contrastErrors.join('; ')}` }
  }

  // Transaction: deactivate all, activate one
  await db.transaction(async (tx) => {
    await tx.update(themes).set({ is_active: false })
    await tx.update(themes).set({ is_active: true }).where(eq(themes.id, themeId))
  })

  revalidatePath('/', 'layout')

  await db.insert(activityLog).values({
    user_id: user.id,
    action: 'theme.activate',
    entity_type: 'theme',
    entity_id: themeId,
  })

  return { success: true }
}
```

## Form usage — `/app/settings/themes/[id]/page.tsx`

```tsx
<form action={updateTheme.bind(null, theme.id)}>
  <label htmlFor="colors.paper">paper</label>
  <input id="colors.paper" name="colors.paper" defaultValue={theme.tokens_json.colors.paper}
         pattern="#[0-9a-fA-F]{6}" required />

  <label htmlFor="fonts.ui">UI Font</label>
  <input id="fonts.ui" name="fonts.ui" list="fonts" defaultValue={theme.tokens_json.fonts.ui} required />
  <datalist id="fonts">
    <option value="Helvetica Neue" />
    <option value="Georgia" />
    <option value="Courier Prime" />
    <option value="Arial" />
    <option value="Times New Roman" />
  </datalist>

  <button type="submit">Save Draft</button>
  <button formAction={activateTheme.bind(null, theme.id)}>Activate Theme</button>
</form>
```

## Render pipeline

```tsx
// app/layout.tsx - Server Component
const activeTheme = await db.query.themes.findFirst({ where: eq(themes.is_active, true) })
const t = activeTheme.tokens_json
return <html style={{
  '--paper': t.colors.paper,
  '--ink': t.colors.ink,
  '--line': t.colors.line,
  '--muted': t.colors.muted,
  '--font-ui': t.fonts.ui,
  '--font-headline': t.fonts.headline,
  '--font-meta': t.fonts.meta,
}}>
```

```css
/* globals.css */
body { background: var(--paper); color: var(--ink); font-family: var(--font-ui); }
h1, h2, h3 { font-family: var(--font-headline); }
.meta, code { font-family: var(--font-meta); color: var(--muted); }
hr { border-color: var(--line); }
```

Hard rules this code enforces: no save or activate below 4.5:1 contrast;
no webfonts (enum blocks them); default theme immutable; all actions
audit-logged; server actions only, no client state.
