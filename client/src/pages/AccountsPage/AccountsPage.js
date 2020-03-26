import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { BOOKEE, DEFACC, CONTRA } from '../../constants'
import accountsApi from '../../api/accounts'
import contractorsApi from '../../api/contractors'
import { preventAndCall } from '../../utils'
import useEditableList from '../../hooks/useEditableList'
import { EditableList, titles } from '../../components'
import formsConfig from './formsConfig'

const { Content } = Layout
const { AccTitle, ContractorTitle } = titles

function handleFilishSuccess(values) {
  if (!values.errorFields) {
    values.vatCategoryS = values.category[0].toUpperCase()
    return values
  }
}

function Accounts() {
  const [currentNav, setNav] = useState(BOOKEE)

  const navigation = {
    [BOOKEE]: {
      title: 'Bookkeeping Accounts',
      headActionTitle: 'Add account',
      ...useEditableList(accountsApi[BOOKEE]),
      formFields: formsConfig[BOOKEE],
      onBeforeSubmit: handleFilishSuccess,
      itemTitleComponent: item => <AccTitle {...item}></AccTitle>,
    },

    [DEFACC]: {
      title: 'Default Accounts',
      headActionTitle: 'Add account',
      ...useEditableList(accountsApi[DEFACC]),
      formFields: formsConfig[DEFACC],
      itemTitleComponent: item => <AccTitle {...item}></AccTitle>,
    },

    [CONTRA]: {
      title: 'Contractors',
      headActionTitle: 'Add contractor',
      ...useEditableList(contractorsApi),
      formFields: formsConfig[CONTRA],
      itemTitleComponent: item => <ContractorTitle {...item}></ContractorTitle>,
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
        <EditableList
          key={navigation[currentNav].title}
          {...navigation[currentNav]}
        />
      </Content>
    </>
  )
}

export default Accounts
