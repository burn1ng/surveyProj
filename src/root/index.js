import React from 'react'
import PropTypes from 'prop-types'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import en from '../locales/en.json'

import App from './app'

const Root = ({ store, history }) => (
  <IntlProvider locale='en' messages={en}>
    <Provider store={store}>
      <ConnectedRouter history={history} >
        <App store={store} />
      </ConnectedRouter>
    </Provider>
  </IntlProvider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
