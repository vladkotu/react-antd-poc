import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'

const { Text } = Typography

function AccTitle({ accNo, category, vatPercent, vatCategoryS, accName }) {
  return (
    <Text>
      <Text strong>{accNo}</Text>
      {` - ${category} - ${vatPercent}% (${vatCategoryS}) - ${accName} `}
    </Text>
  )
}

AccTitle.propTypes = {
  accNo: PropTypes.number,
  vatPercent: PropTypes.number,
  vatCategoryS: PropTypes.string,
  category: PropTypes.string,
  accName: PropTypes.string,
}

export default AccTitle
