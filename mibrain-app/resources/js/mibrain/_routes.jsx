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
const WeeklySummary = lazy(() => import('./screens/insights/weekly'))
const RiskDetail = lazy(() => import('./screens/risk-detail'))

const History = lazy(() => import('./screens/history'))
const HistoryCalendar = lazy(() => import('./screens/history/calendar'))
const HistoryDetail = lazy(() => import('./screens/history/detail'))
const Report = lazy(() => import('./screens/report'))
const Notifications = lazy(() => import('./screens/notifications'))
const Profile = lazy(() => import('./screens/profile'))

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
                        element: <InsightDetail />,                    },
                    {
                        name: 'Weekly Summary',
                        path: 'weekly',
                        element: <WeeklySummary />,                    }
                ]
            },
            {
                name: 'Risk Detail',
                path: 'risk-detail',
                element: <RiskDetail />,
            },
            {
                name: 'History',
                path: 'history',
                element: <History />,
            },
            {
                name: 'History Calendar',
                path: 'history/calendar',
                element: <HistoryCalendar />,
            },
            {
                name: 'Doctor Report',
                path: 'report',
                element: <Report />,
            },
            {
                name: 'Notifications',
                path: 'notifications',
                element: <Notifications />,
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
    }
]
