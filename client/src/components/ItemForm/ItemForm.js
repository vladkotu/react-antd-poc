import React from 'react'
import { Form, InputNumber, Button } from 'antd'
import './styles.css'

const layout = {
  labelCol: { xs: { span: 16 }, sm: { span: 8 } },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { xs: { span: 16, offset: 0 }, sm: { span: 24, offset: 0 } },
}

function ItemForm({
  name,
  currentItem = {},
  fields,
  onCancel,
  onFinish,
  onRemove,
}) {
  const formName = name ? name : `item-form-${currentItem.id || 'no-name'}`
  return (
    <Form
      className='ItemForm-layout'
      {...layout}
      name={formName}
      initialValues={currentItem}
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
        {onRemove && currentItem && (
          <Button onClick={() => onRemove(currentItem)}>Remove</Button>
        )}
      </Form.Item>
    </Form>
  )
}

export default ItemForm
