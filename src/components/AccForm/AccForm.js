import React from 'react'
import { Form, Input, InputNumber, Button, Radio, Checkbox, Layout } from 'antd'
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

const fields = {
  accNo: {
    name: 'accNo',
    label: 'Account Number',
    rules: [required(), number(1, 1000)],
  },

  category: {
    name: 'category',
    label: 'Category',
    rules: [required()],
  },

  vatCategoryS: {
    name: 'vatCategoryS',
    label: 'Vat Category Code',
  },

  vatPercent: {
    name: 'vatPercent',
    label: 'Vat Percentage',
    rules: [required(), number(1, 100)],
  },

  accName: {
    name: 'accName',
    label: 'Account Name',
    rules: [min(2), max(100)],
  },

  extRevenuClass: {
    name: 'extRevenuClass',
    label: 'External Revenue Class',
  },

  extTaxCode: {
    name: 'extTaxCode',
    label: 'External Tax Code',
  },

  comment: {
    name: 'comment',
    label: 'Comment',
  },
}

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

      <Form.Item {...fields.accNo}>
        <InputNumber />
      </Form.Item>

      <Form.Item {...fields.category}>
        <Radio.Group defaultValue='Sales'>
          <Radio.Button value='Sales'>Sales</Radio.Button>
          <Radio.Button value='Purchase'>Purchase</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item {...fields.vatPercent}>
        <InputNumber />
      </Form.Item>

      <Form.Item {...fields.accName}>
        <Input />
      </Form.Item>

      <Form.Item {...fields.extRevenuClass}>
        <Input />
      </Form.Item>

      <Form.Item {...fields.extTaxCode}>
        <Input />
      </Form.Item>

      <Form.Item {...fields.comment}>
        <Input.TextArea />
      </Form.Item>

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
