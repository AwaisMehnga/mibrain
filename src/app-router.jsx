import { Suspense } from 'react'
import { useRoutes } from 'react-router';
import { routes } from './_routes';


export default function AppRouter() {
    const element = useRoutes(routes);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {element}
        </Suspense>
    )
}
