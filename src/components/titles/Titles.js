import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'

const { Text } = Typography

function AccTitle({ accNo, category, vatPercent, vatCategoryS, accName }) {
  return (
    <Text>
      <Text strong>{accNo}</Text>
      <Text>
        - {category} - {vatPercent}% {vatCategoryS && `(${vatCategoryS})`}-{' '}
        {accName}
      </Text>
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

function ContractorTitle({ id, role, salary, fname, lname }) {
  return (
    <Text>
      {fname} {lname} [{role}], {salary} $
    </Text>
  )
}

export default { AccTitle, ContractorTitle }
