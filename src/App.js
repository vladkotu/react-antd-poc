import React from 'react'
import { Layout, Menu } from 'antd'
import logo from './images/logo.svg'
import './App.css'
// import ProfilePage from './pages/Profile'
import AccountsPage from './pages/AccountsPage'

const { Header, Footer, Content } = Layout

function App() {
  return (
    <div>
      <Layout className='App-layout'>
        <Header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1>Test React Feature Collections</h1>
        </Header>
        <AccountsPage />
        <Footer>@ Footer</Footer>
      </Layout>
    </div>
  )
}

export default App
