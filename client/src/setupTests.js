import '@testing-library/jest-dom/extend-expect'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16.1'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

Enzyme.configure({ adapter: new Adapter() })
