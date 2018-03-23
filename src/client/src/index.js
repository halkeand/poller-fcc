import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Provider as ContextProvider } from 'unstated'

import App from './App'
import theme from './ui/theme'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <ContextProvider>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </ContextProvider>,
  document.getElementById('root')
)
registerServiceWorker()
