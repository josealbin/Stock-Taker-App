import React, { useEffect, useState } from 'react'
import '../Products/Products.css'
import axios from 'axios'
import AddProduct from '../AddProduct/AddProduct'
import * as XLSX from 'xlsx'
import Controls from '../Controls/Controls'


function Products() {
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [prodname, setProdname] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState('')
    const [order, setOrder] = useState('')
    const [editId, setEditId] = useState('')
    const [sortorder, setSortorder] = useState('ASC')
    const [fileData, setFileData] = useState(null);


    useEffect(() => {
        axios.get('http://localhost:3001/getProducts')
            .then(res => { setData(res.data); })
            .catch(err => { console.log(err); })
    }, [])


    const calculateStock = () => {
        try {
            const calculatedStock = eval(stock);
            setStock(calculatedStock);
        } catch (err) {
            setStock('invalid input', err);
        }
    };

    const calculateOrder = () => {
        try {
            const calculatedOrder = eval(order);
            setOrder(calculatedOrder);
        } catch (err) {
            setOrder('invalid input', err);
        }
    };


    const handleEdit = (id) => {
        axios.get('http://localhost:3001/getProduct/' + id)
            .then(res => {
                setProdname(res.data.name)
                setCategory(res.data.category)
                setStock(res.data.stock)
                setOrder(res.data.order)
                setEditId(id)
            })
            .catch(err => { console.log(err); })
    }

    const handleUpdate = () => {
        const difference = parseInt(stock) - parseInt(order);
        const updatedData = {
            date: new Date().toLocaleString() + "",
            name: prodname,
            category: category,
            stock: stock,
            order: order,
            difference: difference
        }
        axios.put('http://localhost:3001/updateProduct/' + editId, updatedData)
            .then(res => {
                console.log(res);
                window.location.reload();
                setEditId(null)
            })
            .catch(err => console.log(err));
    }

    const getStatus = (difference) => {
        if (difference <= 0) return 'nil-stock';
        else return 'available';
    };

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/deleteProduct/' + id)
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => { console.log(err); })
    }

    const cancelUpdate = () => {
        window.location.reload();
    }

    const options = [{ label: '- select -', value: 1 }, { label: 'Savoury', value: 2 }, { label: 'Vegan', value: 3 }, { label: 'Ind Tarts', value: 4 }, { label: 'Ind Slices', value: 5 }, { label: 'Muffins', value: 6 }, { label: 'Sweet', value: 7 }]

    const sortCol = (col) => {
        if (sortorder === 'ASC') {
            const sorted = [...data].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            )
            setData(sorted)
            setSortorder('DSC')
        }
        if (sortorder === 'DSC') {
            const sorted = [...data].sort((a, b) =>
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            )
            setData(sorted)
            setSortorder('ASC')
        }
    }

    // Function to handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Assuming your Excel sheet has headers like 'id', 'stock', 'order'
            const updatedData = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(1).map(row => ({
                id: row[0], // Adjust index if ID column is different
                order: row[2], // Adjust index if order column is different
            }));

            setFileData(updatedData);
        };

        reader.readAsArrayBuffer(file);
    };

    // Function to update table data with file data and push changes to the database
    const updateTableWithFileData = () => {
        if (fileData) {
            const updatedColumns = {};

            // Parse the file data and create an object with IDs as keys and updated values
            fileData.forEach(row => {
                const id = row.id; // Assuming ID is a property of each row
                const order = row.order;
                updatedColumns[id] = { order };
            });

            // Update the specific columns (stock and order) in the table data based on IDs
            const updatedTableData = data.map(row => {
                const updatedValues = updatedColumns[row.id];
                if (updatedValues) {
                    return {
                        ...row,
                        order: updatedValues.order,
                        //difference: parseInt(row.stock) - parseInt(updatedValues.order)
                        difference: row.stock - updatedValues.order
                    };
                }
                return row;
            });

            // Now, send an HTTP request to update data in the database
            axios.post('http://localhost:3001/updateData', { updatedTableData })
                .then(res => {
                    setData(res.data);
                    setFileData(null); 
                    window.location.reload();
                })
                .catch(err => console.error(err)); // Handle any errors
        }
    };

    return (
        <div>
            <div>
                <Controls />
            </div>
            <div className="upload_file">
                <input type="file" className='upload_box' onChange={handleFileUpload} />
                <button className="upload-btn" onClick={updateTableWithFileData}>Update</button>
            </div>

            <div className="search_box">
                <input type="text" id="search-input" placeholder="Filter table by Product Name" onChange={(e) => setSearch(e.target.value)} />
            </div>

            <AddProduct />

            <div className="wrapper">
                <div className="table_wrap">
                    <table className="prod_table">
                        <thead className="table_header">
                            <tr className="item">
                                <th>Last_Updated</th>
                                <th>SKU:</th>
                                <th onClick={() => sortCol('name')}>Product_Description <img src="/images/sort.png" alt="" /></th>
                                <th onClick={() => sortCol('category')}>Category <img src="/images/sort.png" alt="" /></th>
                                <th>Qty_In</th>
                                <th>Qty_Out</th>
                                <th>Stock</th>
                                <th>Status <img src="/images/sort.png" alt="" /></th>
                                <th>File</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.filter((item) => { return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search) }).map((product, index) => (
                                    product._id === editId ?
                                        <tr>
                                            <td data-label="Date">{product.date}</td>
                                            <td data-label="Product ID">{product.id}</td>
                                            <td data-label="Product Name"><input type="text" value={prodname} onChange={e => setProdname(e.target.value)} /></td>
                                            <td data-label="Category"><select onChange={e => setCategory(e.target.value)}> {options.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select></td>
                                            <td data-label="Qty_In"><input type="text" value={stock} onChange={e => setStock(e.target.value)} onBlur={calculateStock} /></td>
                                            <td data-label="Qty_Out"><input type="text" value={order} onChange={e => setOrder(e.target.value)} onBlur={calculateOrder} /></td>
                                            <td data-label="Level" className={getStatus(product.difference)}><p>{product.difference}</p></td>
                                            <td data-label="Status" className={getStatus(product.difference)}><p>{getStatus(product.difference)}</p></td>
                                            <td data-label="Downloads" className='download-btn'><img src="/images/download.png" alt="downloads" /></td>
                                            <td>
                                                <button onClick={handleUpdate} className='update-btn'>Update</button>
                                                <button onClick={cancelUpdate} className='remove-btn'>Cancel</button>
                                            </td>
                                        </tr>
                                        :
                                        <tr key={index}>
                                            <td data-label="Date">{product.date}</td>
                                            <td data-label="Product ID">{product.id}</td>
                                            <td data-label="Product Name">{product.name}</td>
                                            <td data-label="Category">{product.category}</td>
                                            <td data-label="Qty_In">{product.stock}</td>
                                            <td data-label="Qty_Out">{product.order}</td>
                                            <td data-label="Level" className={getStatus(product.difference)}><p>{product.difference}</p></td>
                                            <td data-label="Status" className={getStatus(product.difference)}><p>{getStatus(product.difference)}</p></td>
                                            <td data-label="Downloads" className='download-btn'><img src="/images/download.png" alt="downloads" /></td>
                                            <td>
                                                <button className='view-btn'>View</button>
                                                <button onClick={() => handleEdit(product._id)} className='edit-btn'>Edit</button>
                                                <button onClick={() => handleDelete(product._id)} className='remove-btn'>Trash</button>
                                            </td>
                                        </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Products
