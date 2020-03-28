import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Button } from 'antd'
import './styles.css'

const layout = {
  labelCol: { xs: { span: 16 }, sm: { span: 8 } },
  wrapperCol: { span: 12 },
}

const tailLayout = {
  wrapperCol: { xs: { span: 16, offset: 0 }, sm: { span: 16, offset: 8 } },
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

ItemForm.propTypes = {
  name: PropTypes.string,
  currentItem: PropTypes.object,
  fields: PropTypes.array,
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
  onRemove: PropTypes.func,
}

export default ItemForm
