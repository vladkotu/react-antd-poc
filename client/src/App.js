import React from 'react'
import { Layout } from 'antd'
import logo from './images/logo.svg'
import './App.css'
import AccountsPage from './pages/AccountsPage/AccountsPage'

const { Header, Footer } = Layout

function App() {
  return (
    <Layout className='App-layout'>
      <Header className='App-header'>
        <img src={logo} className='App-logo' alt='React test project logo' />
        <h1>React Test Project</h1>
      </Header>
      <AccountsPage />
      <Footer>@ Footer</Footer>
    </Layout>
  )
}

export default App
