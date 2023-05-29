import { Route, Routes,BrowserRouter } from 'react-router-dom'
import './App.css';
import Home from './component/Home';
import ReactHome from './component/ReactHome';

function App() {

  

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<ReactHome></ReactHome>} ></Route>
          <Route exact path='/original' element={<Home></Home>} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
