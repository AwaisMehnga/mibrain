import { lazy } from 'react'
import Layout from './layout'

const Home = lazy(() => import('./screens/home'))
const Log = lazy(() => import('./screens/log'))
const Insights = lazy(() => import('./screens/insights'))
const History = lazy(() => import('./screens/history'))
const Profile = lazy(() => import('./screens/profile'))

// Setup screens
const Welcome = lazy(() => import('./screens/setup/welcome'))
const Conditions = lazy(() => import('./screens/setup/conditions'))
const Triggers = lazy(() => import('./screens/setup/triggers'))
const Medications = lazy(() => import('./screens/setup/medications'))
const NotificationsPermission = lazy(() => import('./screens/setup/notifications'))
const CreateAccount = lazy(() => import('./screens/setup/create-account'))
const SignIn = lazy(() => import('./screens/setup/signin'))

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
    {
        path: '/setup',
        children: [
            {
                path: 'welcome',
                element: <Welcome />,
            },
            {
                path: 'conditions',
                element: <Conditions />,
            },
            {
                path: 'triggers',
                element: <Triggers />,
            },
            {
                path: 'medications',
                element: <Medications />,
            },
            {
                path: 'notifications',
                element: <NotificationsPermission />,
            },
            {
                path: 'create-account',
                element: <CreateAccount />,
            },
            {
                path: 'signin',
                element: <SignIn />,
            },
        ],
    }
]
