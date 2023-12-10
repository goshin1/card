import { Route, Routes,BrowserRouter } from 'react-router-dom'
import './App.css';
import Login from './component/Login';
import Sign from './component/Sign';
import Play from './component/Play';
import Result from './component/Result';
import Score from './component/Score';
import Edit from './component/Edit';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/play' element={<Play></Play>} ></Route>
          <Route exact path='/' element={<Login></Login>} ></Route>
          <Route exact path='/sign' element={<Sign></Sign>}></Route>
          <Route exact path='/result' element={<Result></Result>}></Route>
          <Route exact path='/score' element={<Score></Score>}></Route>
          <Route exact path='/edit' element={<Edit></Edit>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
