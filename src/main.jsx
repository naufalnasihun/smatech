 
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
})
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
