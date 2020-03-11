import React, { useState, useEffect } from 'react'
import { Card, List } from 'antd'
import { Link, AccTitle } from '../components'
import { fetchAccounts } from '../api/accounts'

function Devcards() {
  const [accounts, setAccounts] = useState([])
  useEffect(() => {
    async function _getAccounts() {
      setAccounts(await fetchAccounts(3))
    }
    _getAccounts()
  }, [])

  return (
    <div>
      <Card
        title='Accounts'
        extra={
          <Link add onClick={() => console.log('expand')}>
            New account
          </Link>
        }
      >
        <List
          dataSource={accounts}
          renderItem={acc => (
            <List.Item>
              <AccTitle {...acc}></AccTitle>
              <Link edit onClick={() => console.log('edit')}>
                Edit
              </Link>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Devcards
