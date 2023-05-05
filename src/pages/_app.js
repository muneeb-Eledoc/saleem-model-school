import { AuthProvider } from '@/context/authcontext/AuthContext';
import '@/styles/globals.css'
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {

  return <>
    <NextNProgress
      color="orange"
      startPosition={0.3}
      stopDelayMs={200}
      height={2}
      showOnShallow={true}
      options={{ showSpinner: false }}
    />
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
      }}
    />
    <AuthProvider>

      <Component {...pageProps} />
    </AuthProvider>
  </>
}