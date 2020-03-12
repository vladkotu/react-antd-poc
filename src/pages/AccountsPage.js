import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { Form, Input, InputNumber, Button, Radio } from 'antd'
import EditableList from './Devcards'

const { Content } = Layout

const navigation = {
  bookkeeping: { title: 'Bookkeeping Accounts', key: 'bookk' },
  defaultAccs: { title: 'Default Accounts', key: 'defacc' },
}


const required = () => ({ required: true, message: 'This field is required' })
const number = (min, max) => ({
  type: 'number',
  min: min,
  max: max,
  message: `This field accepts only numbers from ${min} to ${max}`,
})
const min = n => ({
  min: n,
  message: `Minimal length should be ${n} symbol${n === 1 ? '' : 's'}`,
})

const max = n => ({
  max: n,
  message: `Maximum length should be ${n} symbol${n === 1 ? '' : 's'}`,
})

const fields = [
  {
    name: 'accNo',
    label: 'Account Number',
    rules: [required(), number(1, 1000)],
    field: <InputNumber />,
  },

  {
    name: 'category',
    label: 'Category',
    rules: [required()],
    field: (
      <Radio.Group defaultValue='Sales'>
        <Radio.Button value='Sales'>Sales</Radio.Button>
        <Radio.Button value='Purchase'>Purchase</Radio.Button>
      </Radio.Group>
    ),
  },

  {
    name: 'vatPercent',
    label: 'Vat Percentage',
    rules: [required(), number(1, 100)],
    field: <InputNumber />,
  },

  {
    name: 'accName',
    label: 'Account Name',
    rules: [min(2), max(100)],
    field: <Input />,
  },

  {
    name: 'extRevenuClass',
    label: 'External Revenue Class',
    field: <Input />,
  },

  {
    name: 'extTaxCode',
    label: 'External Tax Code',
    field: <Input />,
  },

  {
    name: 'comment',
    label: 'Comment',
    field: <Input.TextArea />,
  },
]

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
            formFields ={fields}
          ></EditableList>
        )}

        {currentNav === navigation.defaultAccs.key && (
          <EditableList
            title='Default Accounts'
            headActionTitle='Add account'
            formFields ={fields.slice(0, fields.length - 3)}
          ></EditableList>
        )}
      </Content>
    </>
  )
}

export default Accounts
