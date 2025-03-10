import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Info from './pages/Info';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
