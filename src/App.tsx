import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { PublicPage } from './pages/PublicPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/calendarioavonmicrocentro" element={<PublicPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
