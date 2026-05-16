import { lazy } from 'react'
import Layout from './layout'

const Home = lazy(() => import('./screens/home'))

// logging screens
const Log = lazy(() => import('./screens/log'))
const PanicAttackLog = lazy(() => import('./screens/log/panic-attack'))
const Attack = lazy(() => import('./screens/log/attack'))
const EndAttack = lazy(() => import('./screens/log/end-attack'))
const VoiceLog = lazy(() => import('./screens/log/voice'))
const CheckIn = lazy(() => import('./screens/check-in'))

// insights screens 
const Insights = lazy(() => import('./screens/insights'))
const Overview = lazy(() => import('./screens/insights/overview'))
const InsightDetail = lazy(() => import('./screens/insights/detail'))

const History = lazy(() => import('./screens/history'))
const HistoryDetail = lazy(() => import('./screens/history/detail'))
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
                name: 'Home',
                element: <Home />,
            },
            {
                name: 'Daily Check-in',
                path: 'check-in',
                element: <CheckIn />,
            },
            {
                name: 'Log Pain',
                path: 'log',
                element: <Log />,
                children: [
                    {
                        index: true,
                        name: 'Attack',
                        element: <Attack />,
                    },
                    {
                        name: 'Panic Attack',
                        path: 'panic-attack',
                        element: <PanicAttackLog />,
                    },
                    {
                        name: 'End Attack',
                        path: 'end-attack',
                        element: <EndAttack />,
                    },
                    {
                        name: 'Voice Log',
                        path: 'voice',
                        element: <VoiceLog />,
                    }
                ],
            },
            {
                path: 'insights',
                element: <Insights />,
                children: [
                    {
                        index: true,
                        name: 'Overview',
                        element: <Overview />,
                    }
                    ,{
                        name: 'Insight Detail',
                        path: 'detail/:trigger',
                        element: <InsightDetail />,
                    }
                ]
            },
            {
                name: 'History',
                path: 'history',
                element: <History />,
            },
            {
                name: 'History Detail',
                path: 'history/:attackId',
                element: <HistoryDetail />,
            },
            {
                name: 'Profile',
                path: 'profile',
                element: <Profile />,
            },
        ],
    },
    {
        path: '/setup',
        children: [
            {
                name: 'Welcome',
                path: 'welcome',
                element: <Welcome />,
            },
            {
                name: 'Conditions',
                path: 'conditions',
                element: <Conditions />,
            },
            {
                name: 'Triggers',
                path: 'triggers',
                element: <Triggers />,
            },
            {
                name: 'Medications',
                path: 'medications',
                element: <Medications />,
            },
            {
                name: 'Notifications Permission',
                path: 'notifications',
                element: <NotificationsPermission />,
            },
            {
                name: 'Create Account',
                path: 'create-account',
                element: <CreateAccount />,
            },
            {
                name: 'Sign In',
                path: 'signin',
                element: <SignIn />,
            },
        ],
    }
]
