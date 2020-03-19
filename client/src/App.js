import React, { useEffect } from 'react'
import { Layout } from 'antd'
import logo from './images/logo.svg'
import './App.css'
import AccountsPage from './pages/AccountsPage/AccountsPage'

const { Header, Footer } = Layout

function App() {
  async function callApi() {
    const res = await fetch('/api/accounts?type=bookkeeping')
    const body = await res.json()
    console.log(body)
    return body
  }
  useEffect(() => {
    callApi()
  }, [])
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
