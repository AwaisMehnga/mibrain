import { lazy } from 'react'
import Layout from './layout'

const Home = lazy(() => import('./screens/home'))
const Log = lazy(() => import('./screens/log'))
const Insights = lazy(() => import('./screens/insights'))
const History = lazy(() => import('./screens/history'))
const Profile = lazy(() => import('./screens/profile'))
export const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                name: 'home',
                element: <Home />,
            },
            {
                name: 'log',
                path: 'log',
                element: <Log />,
            },
            {
                name: 'insights',
                path: 'insights',
                element: <Insights />,
            },
            {
                name: 'history',
                path: 'history',
                element: <History />,
            },
            {
                name: 'profile',
                path: 'profile',
                element: <Profile />,
            },
        ],
    },
]
