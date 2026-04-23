import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <p className="text-8xl font-extrabold text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h1>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="cursor-pointer mt-8 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  )
}

export default NotFoundPage