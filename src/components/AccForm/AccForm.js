import React from 'react'
import { Form, InputNumber, Button } from 'antd'
import './styles.css'

const layout = {
  labelCol: { xs: { span: 16 }, sm: { span: 8 } },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { xs: { span: 16, offset: 0 }, sm: { span: 16, offset: 8 } },
}

function AccForm({ onCancel, onFinish, onRemove, item = {}, fields }) {
  // function handleFilishSuccess(values) {
  //   if (!values.errorFields) {
  //     values.vatCategoryS = values.category[0].toUpperCase()
  //     onFinish(values)
  //   }
  // }

  return (
    <Form
      className='AccForm-layout'
      {...layout}
      name='acc-form'
      initialValues={item}
      onFinish={onFinish}
    >
      <Form.Item name='id' style={{ display: 'none' }}>
        <InputNumber />
      </Form.Item>

      {fields.map(({ field, ...fieldProps }) => (
        <Form.Item key={fieldProps.name} {...fieldProps}>
          {field}
        </Form.Item>
      ))}

      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          Save Changes
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
        {onRemove && <Button onClick={() => onRemove(item)}>Remove</Button>}
      </Form.Item>
    </Form>
  )
}

export default AccForm
