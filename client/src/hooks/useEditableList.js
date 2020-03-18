import { useState, useEffect } from 'react'

function validateInput(input) {
  // CRUD style method names
  const mustHaves = ['addItem', 'fetchItems', 'updateItem', 'removeItem']
  Object.keys(input).forEach(key => {
    if (-1 === mustHaves.indexOf(key) || 'function' !== typeof input[key]) {
      const displayMustHaves = mustHaves.map(m => `'${m}'`).join(', ')

      throw new Error(
        `'useEditableList' hook have to have : ${displayMustHaves} methods`
      )
    }
  })
}

function useEditableList(api) {
  validateInput(api)
  const { addItem, fetchItems, updateItem, removeItem } = api
  const [currentItem, setCurrentItem] = useState(null)
  const [items, setItems] = useState([])

  const getItems = async () => setItems(await fetchItems())

  function commonActions(action) {
    return async item => {
      try {
        await action(item)
        await getItems()
        setCurrentItem(null)
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    getItems()
  }, [])

  return {
    currentItem,
    items,
    setCurrentItem,
    setItems,
    getItems,
    addItem: commonActions(addItem),
    updateItem: commonActions(updateItem),
    removeItem: commonActions(removeItem),
  }
}

export default useEditableList
