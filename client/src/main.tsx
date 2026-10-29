import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from '@tanstack/react-router'
import {router} from './router.tsx'
import {PartificationAppTheme} from './components/PartificationAppTheme.tsx'
import {AuthProvider} from './components/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PartificationAppTheme>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </PartificationAppTheme>
    </StrictMode>,
)
