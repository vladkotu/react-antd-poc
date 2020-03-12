import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import Kitchen from './Devcards'

const { Content } = Layout

const navigation = {
  bookkeeping: { title: 'Bookkeeping Accounts', key: 'bookk' },
  defaultAccs: { title: 'Default Accounts', key: 'defacc' },
}

function Accounts() {
  const defNav = navigation.bookkeeping.key
  const [currentNav, setNav] = useState(defNav)
  return (
    <>
      <Menu
        mode='horizontal'
        defaultSelectedKeys={[defNav]}
      >
        {Object.values(navigation).map(({ title, key }) => (
          <Menu.Item key={key}>
            <a onClick={() => setNav(key)} href='#'>
              {title}
            </a>
          </Menu.Item>
        ))}
      </Menu>

      <Content className='App-content'>
        <Kitchen></Kitchen>
      </Content>
    </>
  )
}

export default Accounts
