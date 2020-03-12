import React from 'react'
import { Layout } from 'antd'
import logo from './images/logo.svg'
import './App.css'
import AccountsPage from './pages/AccountsPage/AccountsPage'

const { Header, Footer } = Layout

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
