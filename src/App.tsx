import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './screens/Login/Login';
import Employees from './screens/Employees/Employees';
import SignUp from './screens/SignUp.tsx/SignUp';
import Test from './screens/Test/Text';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}
