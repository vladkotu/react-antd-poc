import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { Form, Input, InputNumber, Button, Radio } from 'antd'
import { bookkeepingFields, defaultFields } from './formsConfig'
import EditableList from '../Devcards'

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
      <Menu mode='horizontal' defaultSelectedKeys={[defNav]}>
        {Object.values(navigation).map(({ title, key }) => (
          <Menu.Item key={key}>
            <a onClick={() => setNav(key)} href='#'>
              {title}
            </a>
          </Menu.Item>
        ))}
      </Menu>

      <Content className='App-content'>
        {currentNav === navigation.bookkeeping.key && (
          <EditableList
            title='Bookkeeping Accounts'
            headActionTitle='Add account'
            formFields={bookkeepingFields}
          ></EditableList>
        )}

        {currentNav === navigation.defaultAccs.key && (
          <EditableList
            title='Default Accounts'
            headActionTitle='Add account'
            formFields={defaultFields}
          ></EditableList>
        )}
      </Content>
    </>
  )
}

export default Accounts
