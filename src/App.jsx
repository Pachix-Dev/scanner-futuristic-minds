import { QrScanner } from './components/QrScanner'
import './App.css'

function App() {
  return (
    <>
      <header>
        <img src='/igecoLogo.webp' alt='IGECO' width={300} />
      </header>
      <main>
        <QrScanner />
      </main>
    </>
  )
}

export default App
