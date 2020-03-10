import React from 'react'
import { Form, Input, Button, Checkbox, Layout } from 'antd'
import './profile.css'

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

function ProfilePage() {

  function handleFilishSuccess(values) {
    console.log(values)
  }

  function handleFilishError(error) {
    console.log(error)
  }
  return (
    <div className='Profile-layout'>
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
          <Button>Reset</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ProfilePage
