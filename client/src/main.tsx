import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.tsx'
import { PartificationAppTheme } from './components/PartificationAppTheme.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PartificationAppTheme>
      <RouterProvider router={router} />
    </PartificationAppTheme>
  </StrictMode>,
)
