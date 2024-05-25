import React, { useEffect, useState } from 'react'
import '../Customers/Customers.css'
import axios from 'axios'
//import { Link } from 'react-router-dom'
import AddCustomer from '../AddCustomer/AddCustomer'
import Controls from '../Controls/Controls'

function Customers() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [custname, setCustname] = useState('')
  const [region, setRegion] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')
  const [editId, setEditId] = useState('')
  const [sortorder, setSortorder] = useState('ASC')


  useEffect(() => {
    axios.get('http://localhost:3001/getCustomers')
      .then(res => { setData(res.data); })
      .catch(err => { console.log(err); })
  }, [])



  const handleEdit = (id) => {
    axios.get('http://localhost:3001/getCustomer/' + id)
      .then(res => {
        setCustname(res.data.name)
        setRegion(res.data.region)
        setEmail(res.data.email)
        setWebsite(res.data.website)
        setPhone(res.data.phone)
        setStatus(res.data.status)
        setEditId(id)
      })
      .catch(err => { console.log(err); })
  }

  const handleUpdate = () => {
    const updatedData = {
      date: new Date().toLocaleString() + "",
      name: custname,
      region: region,
      email: email,
      website: website,
      phone: phone,
      status: status
    }
    axios.put('http://localhost:3001/updateCustomer/' + editId, updatedData)
      .then(res => {
        window.location.reload();
        setEditId(null)
      })
      .catch(err => console.log(err));
  }

  const handleDelete = (id) => {
    axios.delete('http://localhost:3001/deleteCustomer/' + id)
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(err => { console.log(err); })
  }

  const cancelUpdate = () => {
    window.location.reload();
  }

  const getStatus = (status) => {
    if (status === 'active') return 'active';
    else if(status === 'review') return 'review'
    else return 'inactive';
};

  const regionOptions = [{ label: '- Select -', value: 1 }, { label: 'North Sunshine', value: 2 }, { label: 'South', value: 3 }, { label: 'Gold Coast', value: 4 }, { label: 'Ipswich Toowoomba', value: 5 }, { label: 'City 4000', value: 6 }]
  const statOptions = [{label: '- Select -', value: 1}, {label: 'active', value: 2}, {label: 'inactive', value:3}, {label: 'review', value:4}]

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


  return (
    <div>
      <div>
        <Controls />
      </div>
      <div className='control-icons'>
        <img className='print-logo' src="/images/print.png" alt="download" />
      </div>
      <div className="search_box">
        <input type="text" id="search-input" placeholder="Filter table by Customer Name" onChange={(e) => setSearch(e.target.value)} />
      </div>

      <AddCustomer />

      <div className="wrapper">
        <div className="table_wrap">
          <table className="cust_table">
            <thead className="table_header">
              <tr className="item">
                <th>Added_On</th>
                <th onClick={() => sortCol('name')}>Customer_Description <img src="/images/sort.png" alt="" /></th>
                <th onClick={() => sortCol('region')}>Region <img src="/images/sort.png" alt="" /></th>
                <th>Email</th>
                <th>Website/Booking</th>
                <th>Ph_No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                data.filter((item) => { return search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search) }).map((customer, index) => (
                  customer._id === editId ?
                    <tr>
                      <td data-label="Date">{customer.date}</td>
                      <td data-label="Customer Name"><input type="text" value={custname} onChange={e => setCustname(e.target.value)} /></td>
                      <td data-label="Region"><select onChange={e => setRegion(e.target.value)}> {regionOptions.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select></td>
                      <td data-label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                      <td data-label="Website"><input type="url" value={website} onChange={e => setWebsite(e.target.value)} /></td>
                      <td data-label="Phone"><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></td>
                      <td data-label="Status" className={getStatus(customer.status)}><select onChange={e => setStatus(e.target.value)}> {statOptions.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select></td>
                      <td>
                        <button onClick={handleUpdate} className='view-btn'>Update</button>
                        <button onClick={cancelUpdate} className='remove-btn'>Cancel</button>
                      </td>
                    </tr>
                    :
                    <tr key={index}>
                      <td data-label="Date">{customer.date}</td>
                      <td data-label="Customer Name">{customer.name}</td>
                      <td data-label="Region">{customer.region}</td>
                      <td data-label="Email">{customer.email ? (<a href={`mailto:${customer.email}`}>{customer.email}</a>) : ('-')}</td>
                      <td data-label="Website">{customer.website ? (<a href={customer.website.startsWith('http://') || customer.website.startsWith('https://') ? customer.website : `http://${customer.website}`} target="_blank" rel="noopener noreferrer">{customer.website}</a>) : ('-')}</td>
                      <td data-label="Phone">{customer.phone ? `(+61) ${customer.phone}` : '-'}</td>
                      <td data-label="Status" className={getStatus(customer.status)}><p>{customer.status}</p></td>
                      <td>
                        <button className='view-btn'>View</button>
                        <button onClick={() => handleEdit(customer._id)} className='edit-btn'>Edit</button>
                        <button onClick={() => handleDelete(customer._id)} className='remove-btn'>Trash</button>
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

export default Customers
