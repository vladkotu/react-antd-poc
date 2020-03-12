import React from 'react'
import { InputNumber, Input, Radio } from 'antd'
import { BOOKEE, DEFACC, CONTRA } from '../../constants'

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

const bookkeepingFields = [
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

const defaultFields = bookkeepingFields.slice(
  0,
  bookkeepingFields.length - 3
)

export default {
  [BOOKEE]: bookkeepingFields,
  [DEFACC]: defaultFields,
  [CONTRA]: defaultFields
}
