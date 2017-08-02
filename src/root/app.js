import React from 'react'
import PropTypes from 'prop-types'

import TopMenu from '../containers/top-menu/index'
import Routes from './routes'

import './app.css'

const App = ({ store }) => (
  <div className='app max-height' >
    <TopMenu />

    <Routes />
  </div>
)

App.propTypes = {
  store: PropTypes.object.isRequired
}

export default App
