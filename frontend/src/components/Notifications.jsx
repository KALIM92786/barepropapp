import { Toaster } from 'react-hot-toast';

export default function Notifications() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        style: {
          background: '#1f2937', // bg-gray-800
          color: '#fff',
          border: '1px solid #374151', // border-gray-700
        },

        // Default options for specific types
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}