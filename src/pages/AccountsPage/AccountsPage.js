import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { Form, Input, InputNumber, Button, Radio } from 'antd'
import { bookkeepingFields, defaultFields } from './formsConfig'
import * as api from '../../api/accounts'
import useEditableList from '../../hooks/useEditableList'
import { EditableList } from '../../components'

const { Content } = Layout

const navigation = {
  bookkeeping: { title: 'Bookkeeping Accounts', key: 'bookk' },
  defaultAccs: { title: 'Default Accounts', key: 'defacc' },
}

function Accounts() {
  const defNav = navigation.bookkeeping.key
  const [currentNav, setNav] = useState(defNav)
  const [
    [currentItem, items],
    [setCurrentItem],
    [addItem, , updateItem, removeItem],
  ] = useEditableList(api)

  const commonEditableProps = {
    currentItem,
    items,
    setCurrentItem,
    addItem,
    updateItem,
    removeItem,
    headActionTitle: 'Add account',
  }

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
            {...commonEditableProps}
            title='Bookkeeping Accounts'
            formFields={bookkeepingFields}
          ></EditableList>
        )}

        {currentNav === navigation.defaultAccs.key && (
          <EditableList
            {...commonEditableProps}
            title='Default Accounts'
            formFields={defaultFields}
          ></EditableList>
        )}
      </Content>
    </>
  )
}

export default Accounts
