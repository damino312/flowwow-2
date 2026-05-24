import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import Home from './routes/Home';
import Prediction from './routes/Prediction';
import Promo from './routes/Promo';
import Loading from './routes/Loading';
import Result from './routes/Result';

function App() {

  return (
    <AnimatePresence mode="wait">
      <Router>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          ><Home /></motion.div>} />
          <Route path="/prediction" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            ><Prediction /></motion.div>} />
          <Route path="/loading" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            ><Loading /></motion.div>} />
          <Route path="/promo" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            ><Promo /></motion.div>} />
          <Route path='/result' element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            ><Result /></motion.div>} />
        </Routes>
      </Router>
    </AnimatePresence>

  )
}

export default App
