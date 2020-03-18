import React from 'react'
import { render } from '@testing-library/react'
import ItemForm from './ItemForm'

describe('ItemForm', () => {
  describe('empty form', () => {
    
    b
    test('renders hidden id input field', () => {
      const empty = () => {}
      const formName = 'test-form'
      const { getByText, container } = render(
        <ItemForm name={formName} fields={[]} onCancel={empty} onFinish={empty} />
      )
      const hiddenInput = container.querySelectorAll('input')
      expect(hiddenInput.length).toBe(1)
      expect(hiddenInput[0]).toHaveAttribute('id', `${formName}_id`)
    })
  })
})
