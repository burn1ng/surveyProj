import React from 'react'
import RightNavbar from './RightNavbar'

const Header = () => (
  <div>
    <nav className='navbar navbar-default navbar-static-top'>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar-collapse-0' aria-expanded='false'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar' />
            <span className='icon-bar' />
            <span className='icon-bar' />
          </button>
          <a className='navbar-brand' href='index.html'>
            <img alt="Customer's brand logo" src='img/logo.png' />
          </a>
        </div>

        <RightNavbar />

      </div>
    </nav>
  </div>
)

export default Header
