import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/inter/inter.css'
import './styles/global.scss'
import {Grommet} from 'grommet';
import {dark, ThemeType } from 'grommet/themes';
import {merge} from 'merge-anything'
import {createInstance, MatomoProvider} from '@datapunt/matomo-tracker-react'

const theme: ThemeType = {
  global: {
    font: {
      family: '"Inter", BlinkMacSystemFont, -apple-system, "Helvetica Neue", "Helvetica", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Arial", sans-serif;'
    }
  },
  button: {
    border: {
      radius: '4px'
    }
  }
}

const instance = createInstance({
  urlBase: 'https://stats33.mydevil.net',
  siteId: 121,
})

ReactDOM.render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <Grommet theme={merge(dark, theme) as ThemeType} full>
        <App />
      </Grommet>
    </MatomoProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
