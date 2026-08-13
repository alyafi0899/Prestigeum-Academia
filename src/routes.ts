import { createBrowserRouter } from 'react-router'
import Root from './layouts/Root'
import Home from './pages/Home'
import Training from './pages/Training'
import TrainingDetail from './pages/TrainingDetail'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Gallery from './pages/Gallery'
import About from './pages/About'
import VerifyCertificate from './pages/VerifyCertificate'
import Admin from './pages/Admin'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'training', Component: Training },
      { path: 'training/:id', Component: TrainingDetail },
      { path: 'training/:id/register', Component: Register },
      { path: 'training/:id/register/success', Component: RegisterSuccess },
      { path: 'login', Component: Login },
      { path: 'register', Component: Login },
      { path: 'dashboard', Component: Dashboard },
      { path: 'articles', Component: Articles },
      { path: 'articles/:id', Component: ArticleDetail },
      { path: 'gallery', Component: Gallery },
      { path: 'about', Component: About },
      { path: 'verify-certificate', Component: VerifyCertificate },
    ],
  },
  {
    path: '/admin',
    Component: Admin,
  },
])
