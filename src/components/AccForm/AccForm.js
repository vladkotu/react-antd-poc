import React from 'react'
import { Form, Input, Button, Checkbox, Layout } from 'antd'
import './styles.css'

const layout = {
  labelCol: { xs: { span: 16 }, sm: { span: 8 } },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { xs: { span: 16, offset: 0 }, sm: { span: 16, offset: 8 } },
}

const fields = {
  fname: {
    name: 'fname',
    label: 'First Name',
    rules: [
      { required: true, message: 'This field is required' },
      { min: 2, message: 'Minimal name is 2 symbols' },
      { max: 20, message: 'Minimal name is 20 symbols' },
    ],
  },
  lname: {
    name: 'lname',
    label: 'Last Name',
    rules: [
      { required: true, message: 'This field is required' },
      { max: 30, message: 'Minimal name is 30 symbols' },
    ],
  },
}

function AccForm({ onCancel, onFinish, onRemove, account }) {
  function handleFilishSuccess(values) {
    // check if no errors
    onFinish(account)
  }

  function handleFilishError(error) {
    console.log(error)
  }

  return (
    <div className='AccForm-layout'>
      <Form
        {...layout}
        name='profile-form'
        onFinish={handleFilishSuccess}
        onFinishFailed={handleFilishError}
      >
        <Form.Item {...fields.fname}>
          <Input />
        </Form.Item>

        <Form.Item {...fields.lname}>
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Save Changes
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
          {onRemove && (
            <Button onClick={() => onRemove(account)}>Remove</Button>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default AccForm
