import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import Prediction from './routes/Prediction';
import Promo from './routes/Promo';
import Loading from './routes/Loading';
import Result from './routes/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/promo" element={<Promo />} />
          <Route path="/result" element={<Result />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
