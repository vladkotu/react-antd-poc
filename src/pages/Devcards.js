import React, { useState, useEffect } from 'react'
import { Card, List, Typography } from 'antd'
import { AddingLink, AccTitle } from '../components'
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
          <AddingLink onClick={() => console.log('expand')}>
            New account
          </AddingLink>
        }
      >
        <List
          dataSource={accounts}
          renderItem={acc => (
            <List.Item>
              <AccTitle {...acc}></AccTitle>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default Devcards
