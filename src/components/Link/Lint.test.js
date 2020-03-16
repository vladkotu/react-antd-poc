import React from 'react'
import { render } from '@testing-library/react'
import Link from './Link'

describe('Link', () => {
  test('renders a tag', () => {
    const testHref = '#'
    const { getByText, container } = render(
      <Link href={testHref}>Link text</Link>
    )
    const link = getByText('Link text')
    expect(link.closest('a')).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', testHref)
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders link without logo by default', () => {
    const { queryByRole } = render(<Link href='#'>Link text</Link>)
    const icon = queryByRole('img')
    expect(icon).toBeNull()
  })

  test('able to render edit link', () => {
    const icons = [
      ['add', 'plus'],
      ['edit', 'edit'],
    ]
    for (let [flag, role] of icons) {
      const { getByLabelText } = render(
        <Link {...{ [flag]: true }} href='#'>
          Link text
        </Link>
      )
      const img = getByLabelText(role)
      expect(img).toBeInTheDocument()
    }
  })
})
