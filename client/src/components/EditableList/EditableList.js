import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Card, List } from 'antd'
import { Link, ItemForm } from '../'
import './styles.css'

function EditableList({
  title,
  headActionTitle,
  formFields = [],
  itemTitleComponent = () => {},
  onBeforeSubmit = v => v,
  currentItem,
  setCurrentItem,
  items = [],
  // setItems,
  getItems,
  addItem,
  updateItem,
  removeItem,
}) {
  useEffect(() => {
    getItems()
  }, [])

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

EditableList.propTypes = {
  title: PropTypes.string,
  headActionTitle: PropTypes.string,
  formFields: PropTypes.array,
  itemTitleComponent: PropTypes.func,
  onBeforeSubmit: PropTypes.func,
  currentItem: PropTypes.object,
  setCurrentItem: PropTypes.func,
  items: PropTypes.array,
  setItems: PropTypes.func,
  getItems: PropTypes.func,
  addItem: PropTypes.func,
  updateItem: PropTypes.func,
  removeItem: PropTypes.func,
}

export default EditableList
