import Navbar from './components/Navbar';
import Inbox from './components/Inbox';
import SendEmail from './components/SendEmail';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Mail from './components/Mail';
import Body from './components/Body';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Body />,
    children: [
      {
        path: "/",
        element: <Inbox />
      },
      {
        path: "/mail/:id",
        element: <Mail />
      },
    ]
  }
])

function App() {
  return (
    <div className='bg-[#F6F8FC] dark:bg-[#1b1b1b] w-screen h-screen overflow-hidden text-[#1f1f1f] dark:text-[#e3e3e3]'>
      <Navbar />
      <RouterProvider router={router} />
      <div className='absolute w-[30%] min-w-[460px] bottom-0 right-20 z-10'>
        <SendEmail />
      </div>
    </div>
  )
}

export default App
