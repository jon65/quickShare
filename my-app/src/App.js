import logo from './logo.svg';
import './App.css';
import { QuickShareContext, QuickShareProvider } from './context/quickShareContext';
import { Dashboard } from './Dashboard';

function App() {
  return (
    <QuickShareProvider>
      <div>
      <Dashboard/>
      </div>
    </QuickShareProvider>
  );
}

export default App;
