import React from 'react'
import { Layout, Menu } from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'
import { BOOKEE, DEFACC, CONTRA } from '../../constants'
import accountsApi from '../../api/accounts'
import contractorsApi from '../../api/contractors'
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
  const navigation = {
    [BOOKEE]: {
      title: 'Bookkeeping Accounts',
      headActionTitle: 'Add account',
      uri: '/bookkeeping',
      ...useEditableList(accountsApi[BOOKEE]),
      formFields: formsConfig[BOOKEE],
      onBeforeSubmit: handleFilishSuccess,
      itemTitleComponent: AccTitle,
    },

    [DEFACC]: {
      title: 'Default Accounts',
      headActionTitle: 'Add account',
      uri: '/default',
      ...useEditableList(accountsApi[DEFACC]),
      formFields: formsConfig[DEFACC],
      itemTitleComponent: AccTitle,
    },

    [CONTRA]: {
      title: 'Contractors',
      headActionTitle: 'Add contractor',
      uri: '/contractors',
      ...useEditableList(contractorsApi),
      formFields: formsConfig[CONTRA],
      itemTitleComponent: ContractorTitle,
    },
  }

  return (
    <Router>
      <Menu mode='horizontal' defaultSelectedKeys={BOOKEE}>
        {Object.entries(navigation).map(([key, { title, uri }]) => (
          <Menu.Item key={key}>
            <Link to={uri}> {title} </Link>
          </Menu.Item>
        ))}
      </Menu>

      <Content className='App-content'>
        <Switch>
          <Route exact path='/'>
            <Redirect exact from='/' to={navigation[BOOKEE].uri} />
          </Route>
          {Object.entries(navigation).map(([key, { uri }]) => (
            <Route key={key} path={uri}>
              <EditableList {...navigation[key]} />
            </Route>
          ))}
        </Switch>
      </Content>
    </Router>
  )
}

export default Accounts
