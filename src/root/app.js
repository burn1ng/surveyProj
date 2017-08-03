import React from 'react'
import ReactDOM from 'react-dom'

import Header from '../containers/top-menu/Header'
import Copyright from '../components/Copyright'

console.log(React)
console.log(ReactDOM)

const App = () => (
  <div>
    <Header />
    <Copyright />
  </div>
)

export default App

// import React from 'react'
// import PropTypes from 'prop-types'

// import TopMenu from '../containers/top-menu/index'
// import Routes from './routes'

// import './app.css'

// const App = ({ store }) => (
//   <div className='app max-height' >
//     <TopMenu />

//     <Routes />
//   </div>
// )

// App.propTypes = {
//   store: PropTypes.object.isRequired
// }

// export default App
