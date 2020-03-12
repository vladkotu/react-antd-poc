import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { bookkeepingFields, defaultFields } from './formsConfig'
import api from '../../api/accounts'
import { preventAndCall } from '../../utils'
import useEditableList from '../../hooks/useEditableList'
import { EditableList } from '../../components'

const { Content } = Layout

const navigation = {
  bookkeeping: { title: 'Bookkeeping Accounts', key: 'bookk' },
  defaultAccs: { title: 'Default Accounts', key: 'defacc' },
}

function Accounts() {
  const [currentNav, setNav] = useState(navigation.bookkeeping.key)
  const bookkeepingProps = useEditableList(api.bookkeepingAccounts)
  const defaultAccProps = useEditableList(api.defaultAccounts)

  return (
    <>
      <Menu
        mode='horizontal'
        defaultSelectedKeys={[navigation.bookkeeping.key]}
      >
        {Object.values(navigation).map(({ title, key }) => (
          <Menu.Item key={key}>
            <a onClick={preventAndCall(setNav, key)} href='/#'>
              {title}
            </a>
          </Menu.Item>
        ))}
      </Menu>

      <Content className='App-content'>
        {currentNav === navigation.bookkeeping.key && (
          <EditableList
            title={'Bookkeeping Accounts '}
            headActionTitle='Add account'
            formFields={bookkeepingFields}
            {...bookkeepingProps}
          ></EditableList>
        )}

        {currentNav === navigation.defaultAccs.key && (
          <EditableList
            title={`Default Accounts (${bookkeepingProps.items.length})`}
            headActionTitle='Add account'
            formFields={defaultFields}
            {...defaultAccProps}
          ></EditableList>
        )}
      </Content>
    </>
  )
}

export default Accounts
