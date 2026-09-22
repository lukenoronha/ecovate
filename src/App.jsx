import { StoreProvider } from './state/StoreContext';
import { Shell } from './components/common/Shell';

function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

export default App;
