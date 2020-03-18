import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Form, InputNumber, Input } from 'antd'
import ItemForm from './ItemForm'

function makeProps(props) {
  return {
    name: 'testForm',
    fields: [],
    currentItem: { id: 'testId' },
    onRemove: jest.fn(),
    onCancel: jest.fn(),
    onFinish: jest.fn(),
    ...props,
  }
}

describe('ItemForm', () => {
  describe('default fields', () => {
    let utils = {}
    let props = {}
    beforeEach(() => {
      props = makeProps({ name: 'empty-test-form' })
      utils = render(<ItemForm {...props} />)
    })

    it('renders hidden id input field that stores item id', () => {
      const { container } = utils
      const hiddenInput = container.querySelectorAll('input')
      expect(hiddenInput.length).toBe(1)
      expect(hiddenInput[0]).toHaveAttribute('id', `${props.name}_id`)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('renders cancel action control', () => {
      const { getByText } = utils
      const button = getByText(/Cancel/i)
      fireEvent.click(button, { button: 1 })
      expect(props.onCancel).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
    })

    it('renders remove action control conditionally', () => {
      const { getByText } = utils
      const button = getByText(/Remove/i)
      fireEvent.click(button, { button: 1 })
      expect(props.onRemove).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
    })
  })

  describe('renders custom fields', () => {
    let utils = {}
    let props = {}
    beforeEach(() => {
      props = makeProps({
        name: 'custom-test-form',
        fields: [
          {
            name: 'numfield',
            label: 'Number Field',
            rules: [
              {
                required: true,
              },
            ],
            field: <InputNumber />,
          },
          {
            name: 'text-field',
            label: 'Text Field',
            field: <Input />,
          },
        ],
      })
      utils = render(<ItemForm {...props} />)
    })

    it('renders 2 input fields', () => {
      const { getByLabelText } = utils
      const field1 = getByLabelText(/Number Field/i)
      const field2 = getByLabelText(/Text Field/i)
      expect(field1).toBeInTheDocument()
      expect(field2).toBeInTheDocument()
    })

    const delay = (timeout = 0) =>
      new Promise(resolve => {
        setTimeout(resolve, timeout)
      })

    it('does not submits values if required field is not filled', async () => {
      const { container } = utils
      const form = container.querySelector('form')
      fireEvent.submit(form)
      await delay()
      expect(props.onFinish).not.toHaveBeenCalled()
    })

    it('submits proper values', async () => {
      const { getByLabelText, container } = utils
      const field1 = getByLabelText(/Number Field/i)
      const field2 = getByLabelText(/Text Field/i)
      const form = container.querySelector('form')
      fireEvent.change(field1, { target: { value: 3 } })
      fireEvent.change(field2, { target: { value: 'field value' } })
      fireEvent.submit(form)
      await delay()
      expect(props.onFinish).toHaveBeenCalledWith({
        id: props.currentItem.id,
        numfield: 3,
        'text-field': 'field value',
      })
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
