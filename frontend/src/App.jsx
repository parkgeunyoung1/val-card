import { useState } from 'react';
import GachaPage from './pages/GachaPage';
import CollectionPage from './pages/CollectionPage';
import './App.css';

function App() {
  const [page,  setPage]  = useState('gacha');
  const [slots, setSlots] = useState(Array(5).fill(null));

  return (
    <div className="app">
      {page === 'gacha'
        ? <GachaPage slots={slots} setSlots={setSlots} onGoCollection={() => setPage('collection')} />
        : <CollectionPage slots={slots} setSlots={setSlots} onBack={() => setPage('gacha')} />
      }
    </div>
  );
}

export default App;
