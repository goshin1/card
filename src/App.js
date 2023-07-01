import { Route, Routes,BrowserRouter } from 'react-router-dom'
import './App.css';
import Home from './component/Home';
import Sign from './component/Sign';
import ReactHome from './component/ReactHome';
import Result from './component/Result';
import Score from './component/Score';

function App() {

  

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/play' element={<ReactHome></ReactHome>} ></Route>
          <Route exact path='/' element={<Home></Home>} ></Route>
          <Route exact path='/sign' element={<Sign></Sign>}></Route>
          <Route exact path='/result' element={<Result></Result>}></Route>
          <Route exact path='/score' element={<Score></Score>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
