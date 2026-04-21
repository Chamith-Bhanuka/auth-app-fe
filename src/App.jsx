import { RouterProvider } from 'react-router-dom';
import { Router } from './routes/Router.jsx';

export default function App() {
  return <RouterProvider router={Router} />;
}
