import React, { useEffect, useState } from 'react'
import '../AddProduct/AddProduct.css'
import axios from 'axios'

function AddProduct() {

  const [newID, setNewID] = useState('')
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newStock, setNewStock] = useState(0)
  const [newOrder, setNewOrder] = useState(0)


  useEffect(() => {
    axios.get('http://localhost:3001/getProducts')
      .then(res => { console.log(res); })
      .catch(err => { console.log(err); })
  }, [])

  const handleAdd = (event) => {
    event.preventDefault()
    const addedData = {
      date: new Date().toLocaleString() + "",
      id: newID,
      name: newName,
      category: newCategory,
      stock: newStock,
      order: newOrder,
      difference: newStock - newOrder
    }

    axios.post('http://localhost:3001/addProduct', addedData)
      .then(res => {
        console.log(res.data);
        window.location.reload();
        setNewID(null)
      }).catch(err => { console.log(err); })
  }

  const handleCancel = () => {
    window.location.reload()
  }

  const options = [{label: '- select -', value: 1}, {label: 'Savoury', value: 2}, {label: 'Vegan', value:3}, {label: 'Ind Tarts', value:4}, {label: 'Ind Slices', value:5}, { label: 'Muffins', value: 6 }, { label: 'Sweet', value: 7 }]

  return (
    <div className="add-container">
      <form onSubmit={handleAdd}>
        <div className="form-field">
          <div className="input-field">
            <label htmlFor="pid">SKU:</label>
            <input type="text" placeholder="SKU" required onChange={e => setNewID(e.target.value)} /><br />
          </div>
          <div className="input-field">
            <label htmlFor="pname">Name:</label>
            <input type="text" placeholder="Description" required onChange={e => setNewName(e.target.value)} /><br />
          </div>
          <div className="select-field">
            <label htmlFor="pcategory">Category:</label>
            <select onChange={e => setNewCategory(e.target.value)}> {options.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select><br />
          </div>
          <div className="input-field">
            <label htmlFor="pstockin">Quantity In:</label>
            <input type="text" placeholder="Qty In" onChange={e => setNewStock(e.target.value)} /><br />
          </div>
          <div className="input-field">
            <label htmlFor="pstockout">Quantity Out:</label>
            <input type="text" placeholder="Qty Out" onChange={e => setNewOrder(e.target.value)} /><br />
          </div>
          <div className="control-field">
            <button className="add-btn">Add</button>
            <button className="cancel-btn" onClick={handleCancel}>Reset</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
