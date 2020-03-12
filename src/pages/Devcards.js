import React from 'react'
import { Row, Card, List } from 'antd'
import { Link, AccTitle, AccForm } from '../components'
import useEditableList from '../hooks/useEditableList'
import * as api from '../api/accounts'
import './styles.css'

function Devcards({ title, headActionTitle, formFields }) {
  const [
    [currentItem, items],
    [setCurrentItem],
    [addItem, , updateItem, removeItem],
  ] = useEditableList(api)

  const cardProps = {
    title,
    extra: headActionTitle ? (
      <Link add onClick={() => setCurrentItem(0)}>
        {headActionTitle}
      </Link>
    ) : null,
  }

  return (
    <div className='EditableList'>
      <Card {...cardProps}>
        {0 === currentItem && (
          <AccForm
            fields={formFields}
            onCancel={() => setCurrentItem(null)}
            onFinish={addItem}
          />
        )}
        <List
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <Row>
                <AccTitle {...item}></AccTitle>
                <Link edit onClick={() => setCurrentItem(item.id)}>
                  Edit
                </Link>
              </Row>
              {currentItem === item.id && (
                <AccForm
                  fields={formFields}
                  onRemove={removeItem}
                  item={item}
                  onCancel={() => setCurrentItem(null)}
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
