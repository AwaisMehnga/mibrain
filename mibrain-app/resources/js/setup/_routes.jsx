import { Navigate, lazy } from 'react'
import Layout from './layout'

const Home = lazy(() => import('../mibrain/screens/home'))

// logging screens
const Log = lazy(() => import('../mibrain/screens/log'))
const PanicAttackLog = lazy(() => import('../mibrain/screens/log/panic-attack'))
const Attack = lazy(() => import('../mibrain/screens/log/attack'))
const EndAttack = lazy(() => import('../mibrain/screens/log/end-attack'))
const VoiceLog = lazy(() => import('../mibrain/screens/log/voice'))
const CheckIn = lazy(() => import('../mibrain/screens/check-in'))

// insights screens 
const Insights = lazy(() => import('../mibrain/screens/insights'))
const Overview = lazy(() => import('../mibrain/screens/insights/overview'))
const InsightDetail = lazy(() => import('../mibrain/screens/insights/detail'))
const WeeklySummary = lazy(() => import('../mibrain/screens/insights/weekly'))
const RiskDetail = lazy(() => import('../mibrain/screens/risk-detail'))

const History = lazy(() => import('../mibrain/screens/history'))
const HistoryCalendar = lazy(() => import('../mibrain/screens/history/calendar'))
const HistoryDetail = lazy(() => import('../mibrain/screens/history/detail'))
const Report = lazy(() => import('../mibrain/screens/report'))
const Notifications = lazy(() => import('../mibrain/screens/notifications'))
const Profile = lazy(() => import('../mibrain/screens/profile'))

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
        path: '/setup',
        children: [
            {
                index: true,
                element: <Navigate to="register" replace />,
            },
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
                path: 'register',
                element: <CreateAccount />,
            },
            {
                name: 'Sign In',
                path: 'login',
                element: <SignIn />,
            },
        ],
    }
]
