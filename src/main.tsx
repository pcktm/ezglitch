import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/inter/inter.css'
import './styles/global.scss'
import {Grommet} from 'grommet';
import {dark, ThemeType } from 'grommet/themes';
import {merge} from 'merge-anything'

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


ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={merge(dark, theme) as ThemeType} full>
      <App />
    </Grommet>
  </React.StrictMode>,
  document.getElementById('root')
)
