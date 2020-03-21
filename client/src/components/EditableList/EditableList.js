import React from 'react'
import { Row, Card, List } from 'antd'
import { Link, ItemForm } from '../'
import './styles.css'

function EditableList({
  title,
  headActionTitle,
  currentItem,
  items,
  formFields = [],
  itemTitleComponent = () => null,

  onBeforeSubmit = v => v,
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
          <ItemForm
            fields={formFields}
            onCancel={() => setCurrentItem(null)}
            onFinish={addItem}
          />
        )}
        <List
          dataSource={items}
          pagination={items.length > 10}
          renderItem={item => (
            <List.Item>
              <Row>
                {itemTitleComponent(item)}
                <Link edit onClick={() => setCurrentItem(item.id)}>
                  Edit
                </Link>
              </Row>
              {currentItem === item.id && (
                <ItemForm
                  currentItem={item}
                  fields={formFields}
                  onRemove={removeItem}
                  onCancel={() => setCurrentItem(null)}
                  onFinish={v => updateItem(onBeforeSubmit(v))}
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
