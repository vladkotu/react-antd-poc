import React from 'react'
import PropTypes from 'prop-types'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import './Link.css'

function Link({ children, add, edit, ...props }) {
  return (
    <a {...props}>
      {add && <PlusOutlined className='Link-icon' />}
      {edit && <EditOutlined className='Link-icon' />}
      {children}
    </a>
  )
}

Link.propTypes = {
  add: PropTypes.bool,
  edit: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default Link
