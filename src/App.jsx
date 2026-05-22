import { RouterProvider } from 'react-router-dom'
import router from './routes/Router'
import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
 
)
}

export default App
