import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";


import Nav from './components/Nav'
import Home from './pages/Home'
import GameRoom from './pages/GameRoom'
import Letters from "./pages/Letters";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Nav />}>
      <Route path="/" element={<Home />}/>
      <Route path="/GameRoom/:age" element={<GameRoom />}/>
      <Route path="/Letters/:age" element={<Letters />}/>
    </Route>
  )
)

function App() {
  return (
    <>
     <RouterProvider router={router} />
      
    </>
  )
}

export default App
