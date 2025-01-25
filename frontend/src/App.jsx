import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUP from './components/auth/SignUp';
import Home from './components/shared/Home';
import CreateTasks from './components/tasks/CreateTasks';
import Dashboard from './components/dashboard/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoginForm from './components/auth/Login';
import { ToastContainer } from 'react-toastify';
import EditTasks from './components/tasks/EditTasks';

const queryClient = new QueryClient();

function App() {

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <LoginForm />
    },
    {
      path: '/signUp',
      element: <SignUP />
    },
    {
      path: '/createTasks',
      element: <CreateTasks />
    },
    {
      path: '/createTasks/:id',
      element: <CreateTasks />
    },
    {
      path: '/editTasks',
      element: <EditTasks />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    }

  ]);

  return (
    <>
      <div>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme' >
          <QueryClientProvider client={queryClient} >
            <ReactQueryDevtools initialIsOpen={false} />
            <RouterProvider router={appRouter} />
          </QueryClientProvider>
        </ThemeProvider>
        <ToastContainer/>
      </div>

    </>
  )
}

export default App
