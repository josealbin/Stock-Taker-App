import React, { useEffect, useState } from 'react'
import '../AddCustomer/AddCustomer.css'
import axios from 'axios'
function AddCustomer() {

    const [newCustName, setNewCustName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newRegion, setNewRegion] = useState('')
    const [newPhone, setNewPhone] = useState(0)
    const [newWebsite, setNewWebsite] = useState('')
    const [newStatus, setNewStatus] = useState('')

    useEffect(() => {
        axios.get('http://localhost:3001/getCustomers')
            .then(res => { console.log(res.data); })
            .catch(err => { console.log(err); })
    })

    const handleAdd = (event) => {
        event.preventDefault()
        const addedData = {
            date: new Date().toLocaleString() + "",
            name: newCustName,
            email: newEmail,
            website: newWebsite,
            region: newRegion,
            phone: newPhone,
            status: newStatus
        }

        axios.post('http://localhost:3001/addCustomer', addedData)
            .then(res => {
                console.log(res.data);
                window.location.reload();
            }).catch(err => { console.log(err); })
    }

    const handleCancel = () => {
        window.location.reload()
    }

    const regionOptions = [{label: '- Select -', value: 1}, {label: 'North Sunshine', value: 2}, {label: 'South', value:3}, {label: 'Gold Coast', value:4}, {label: 'Ipswich Toowoomba', value:5}, {label: 'City 4000', value:6}]
    const statOptions = [{label: '- Select -', value: 1}, {label: 'active', value: 2}, {label: 'inactive', value:3}, {label: 'review', value:4}]

    return (
        <div className="add-container">
            <form onSubmit={handleAdd}>
                <div className="form-field">
                    <div className="input-field">
                        <label htmlFor="name">Name:</label>
                        <input type="text" placeholder="Customer Name" onChange={e => setNewCustName(e.target.value)} required /><br />
                    </div>
                    <div className="select-field">
                        <label htmlFor="region">Region:</label>
                        <select onChange={e => setNewRegion(e.target.value)}> {regionOptions.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select><br />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email:</label>
                        <input type="email" placeholder="Email" onChange={e => setNewEmail(e.target.value)} /><br />
                    </div>
                    <div className="input-field">
                        <label htmlFor="website">Website:</label>
                        <input type="text" placeholder="Website" onChange={e => setNewWebsite(e.target.value)} /><br />
                    </div>
                    <div className="input-field">
                        <label htmlFor="phone">Phone:</label>
                        <input type="tel" placeholder="Phone Number" onChange={e => setNewPhone(e.target.value)} /><br />
                    </div>
                    <div className="select-field">
                        <label htmlFor="status">Status:</label>
                        <select onChange={e => setNewStatus(e.target.value)}> {statOptions.map(option => (<option key={option.value} value={option.label}>{option.label}</option>))}</select><br />
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

export default AddCustomer
