import logo from './logo.svg';
import './App.css';
import { QuickShareContext, QuickShareProvider } from './context/quickShareContext';
import { Dashboard } from './Dashboard';
import Download from './Download';
import Homepage from './Homepage';
function App() {
  return (
    <QuickShareProvider>
      <div>
        {/* <Homepage/> */}
        <Dashboard />
        <Download/>
      </div>
    </QuickShareProvider>
  );
}

export default App;
