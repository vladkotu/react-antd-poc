import React from 'react'
import { Form, Input, InputNumber, Button, Radio } from 'antd'
import './styles.css'

const layout = {
  labelCol: { xs: { span: 16 }, sm: { span: 8 } },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { xs: { span: 16, offset: 0 }, sm: { span: 16, offset: 8 } },
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
    children: <InputNumber />,
  },

  {
    name: 'category',
    label: 'Category',
    rules: [required()],
    children: (
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
    children: <InputNumber />,
  },

  {
    name: 'accName',
    label: 'Account Name',
    rules: [min(2), max(100)],
    children: <Input />,
  },

  {
    name: 'extRevenuClass',
    label: 'External Revenue Class',
    children: <Input />,
  },

  {
    name: 'extTaxCode',
    label: 'External Tax Code',
    children: <Input />,
  },

  {
    name: 'comment',
    label: 'Comment',
    children: <Input.TextArea />,
  },
]

function AccForm({ onCancel, onFinish, onRemove, account = {} }) {
  function handleFilishSuccess(values) {
    if (!values.errorFields) {
      values.vatCategoryS = values.category[0].toUpperCase()
      onFinish(values)
    }
  }

  return (
    <Form
      className='AccForm-layout'
      {...layout}
      name='acc-form'
      initialValues={account}
      onFinish={handleFilishSuccess}
    >
      <Form.Item name='id' style={{ display: 'none' }}>
        <InputNumber />
      </Form.Item>

      {fields.map(({ children, ...fieldProps }) => (
        <Form.Item key={fieldProps.name} {...fieldProps}>
          {children}
        </Form.Item>
      ))}

      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          Save Changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
        {onRemove && <Button onClick={() => onRemove(account)}>Remove</Button>}
      </Form.Item>
    </Form>
  )
}

export default AccForm
