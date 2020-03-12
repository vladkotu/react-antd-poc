import React from 'react'
import { Row, Card, List } from 'antd'
import { Link, AccTitle, AccForm } from '../'
import './styles.css'

function EditableList({
  title,
  headActionTitle,
  formFields,
  currentItem,
  items,
  setCurrentItem,
  addItem,
  updateItem,
  removeItem,
}) {
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
export default EditableList
