import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { BOOKEE, DEFACC, CONTRA } from '../../constants'
import accountsApi from '../../api/accounts'
import contractorsApi from '../../api/contractors'
import { preventAndCall } from '../../utils'
import useEditableList from '../../hooks/useEditableList'
import { EditableList } from '../../components'
import formsConfig from './formsConfig'

const { Content } = Layout

function Accounts() {
  const [currentNav, setNav] = useState(BOOKEE)

  const navigation = {
    [BOOKEE]: {
      title: 'Bookkeeping Accounts',
      headActionTitle: 'Add account',
      ...useEditableList(accountsApi[BOOKEE]),
      formFields: formsConfig[BOOKEE],
    },
    [DEFACC]: {
      title: 'Default Accounts',
      headActionTitle: 'Add account',
      ...useEditableList(accountsApi[DEFACC]),
      formFields: formsConfig[DEFACC],
    },
    [CONTRA]: {
      title: 'Contractors',
      headActionTitle: 'Add contractor',
      ...useEditableList(contractorsApi),
      formFields: formsConfig[CONTRA],
    },
  }

  return (
    <>
      <Menu mode='horizontal' defaultSelectedKeys={BOOKEE}>
        {Object.entries(navigation).map(([key, { title }]) => (
          <Menu.Item key={key}>
            <a onClick={preventAndCall(setNav, key)} href='/#'>
              {title}
            </a>
          </Menu.Item>
        ))}
      </Menu>

      <Content className='App-content'>
        <EditableList {...navigation[currentNav]} />
      </Content>
    </>
  )
}

export default Accounts
