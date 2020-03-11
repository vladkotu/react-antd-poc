import React from 'react'
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons'
import './AddingLink.css'

function AddingLink({ children, ...props }) {
  return (
    <a {...props}>
      <PlusOutlined className='AddingLink-icon' />
      {children}
    </a>
  )
}

AddingLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default AddingLink
