import React, { useState, useEffect } from 'react'
import { Card, List, Typography } from 'antd'
import { AddingLink } from '../components'
import { getAccounts } from '../api/accounts'

function Devcards() {
  const [accounts, setAccounts] = useState([])
  useEffect(() => {
    async function fetchAccounts() {
      setAccounts(await getAccounts(3))
    }
    fetchAccounts()
  }, [])

  return (
    <div>
      <Card
        title='Accounts'
        extra={
          <AddingLink onClick={() => console.log('expand')}>
            New account
          </AddingLink>
        }
      >
        <List
          dataSource={accounts}
          renderItem={acc => (
            <List.Item>
              <Typography.Text>{acc.accName}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Devcards
