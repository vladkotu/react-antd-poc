import React, { useState, useEffect } from 'react'
import { Row, Card, List } from 'antd'
import { Link, AccTitle, AccForm } from '../components'
import {
  fetchAccounts,
  removeAccount,
  addAccount,
  editAccount,
} from '../api/accounts'
import './styles.css'

function accontByAccNo(accounts, targetNo) {
  return accounts.find(({ accNo }) => accNo === targetNo)
}

function Devcards() {
  const [editingNo, setEditing] = useState(null)
  const [accounts, setAccounts] = useState([])

  const getItems = async () => setAccounts(await fetchAccounts(3))

  function commonActions(action) {
    return async item => {
      try {
        await action(item)
        await getItems()
        setEditing(null)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const updateItem = commonActions(editAccount)
  const addItem = commonActions(addAccount)
  const removeItem = commonActions(removeAccount)

  useEffect(() => {
    getItems()
  }, [])

  return (
    <div className='Acc'>
      <Card
        title='Accounts'
        extra={
          <Link add onClick={() => setEditing(0)}>
            New account
          </Link>
        }
      >
        {0 === editingNo && (
          <AccForm onCancel={() => setEditing(null)} onFinish={addItem} />
        )}
        <List
          dataSource={accounts}
          renderItem={acc => (
            <List.Item>
              <Row>
                <AccTitle {...acc}></AccTitle>
                <Link edit onClick={() => setEditing(acc.accNo)}>
                  Edit
                </Link>
              </Row>
              {editingNo === acc.accNo && (
                <AccForm
                  onRemove={removeItem}
                  account={accontByAccNo(accounts, acc.accNo)}
                  onCancel={() => setEditing(null)}
                  onFinish={updateItem}
                />
              )}
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}
export default Devcards
