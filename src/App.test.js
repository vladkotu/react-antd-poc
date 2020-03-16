import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

jest.mock('./pages/AccountsPage/AccountsPage', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Account Page</div>
    },
  }
})

test('renders header, footer and accounts page', () => {
  const { getByAltText, container } = render(<App />)
  const logoElement = getByAltText(/React test project logo/i)
  expect(logoElement).toBeInTheDocument()
  expect(container.firstChild).toMatchSnapshot()
})
