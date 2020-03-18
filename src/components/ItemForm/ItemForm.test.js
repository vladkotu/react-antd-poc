import React from 'react'
import { render, fireEvent } from '@testing-library/react'
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
  describe('empty form', () => {
    let utils = {}
    let props = {}
    beforeEach(() => {
      props = makeProps({ name: 'empty-test-form' })
      utils = render(<ItemForm {...props} />)
    })

    test('renders hidden id input field that stores item id', () => {
      const { container } = utils
      const hiddenInput = container.querySelectorAll('input')
      expect(hiddenInput.length).toBe(1)
      expect(hiddenInput[0]).toHaveAttribute('id', `${props.name}_id`)
      expect(container.firstChild).toMatchSnapshot()
    })

    test('renders cancel action control', () => {
      const { getByText } = utils
      const button = getByText(/Cancel/i)
      fireEvent.click(button, { button: 1 })
      expect(props.onCancel).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
    })

    test('renders remove action control conditionally', () => {
      const { getByText } = utils
      const button = getByText(/Remove/i)
      fireEvent.click(button, { button: 1 })
      expect(props.onRemove).toHaveBeenCalled()
      expect(button).toBeInTheDocument()
    })
  })
})
