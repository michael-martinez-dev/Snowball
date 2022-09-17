import React, {useEffect, useState} from 'react';
import './Debt.css'
import {DeleteDebtItem, GetDebt, GetTotalDebtAmount, GetTotalMonthlyDebtAmount, SubmitDebtItem} from "../../wailsjs/go/debt/Debt";

function Debt() {
    const [debt, setDebt]           = useState([]);
    const [debtTotal, setDebtTotal] = useState(0.0)
    const [monthlyDebtTotal, setMonthlyDebtTotal] = useState(0.0)
    const updateDebt      = (result) => setDebt(result)
    const updateDebtTotal = (result) => setDebtTotal(result)
    const updateMonthlyDebtTotal = (result) => setMonthlyDebtTotal(result)
    const getDebt         = () => GetDebt()
                                    .then(updateDebt)
                                    .catch(console.error)
    const getDebtTotal = () => GetTotalDebtAmount()
                                    .then(updateDebtTotal)
                                    .catch(console.error)
    const getMonthlyDebtTotal = () => GetTotalMonthlyDebtAmount()
                                    .then(updateMonthlyDebtTotal)
                                    .catch(console.error)
    useEffect(() => {
        getDebt()
        getDebtTotal()
        getMonthlyDebtTotal()
    }, [])

    const [name, setName]           = useState('');
    const [debtType, setType]       = useState('');
    const [total, setTotal]         = useState('');
    const [monthly, setMonthly]     = useState('');
    const [due, setDue]             = useState('');
    const [submitErr, setSubmitErr] = useState('');

    const updateName    = (e) => setName(e.target.value);
    const updateType    = (e) => setType(e.target.value);
    const updateTotal   = (e) => setTotal(e.target.value);
    const updateMonthly = (e) => setMonthly(e.target.value);
    const updateDue     = (e) => setDue(e.target.value);


    let dollarRe = /^(\d+\.\d{2})$/
    let numRe = /^(\d+)$/
    let dueRe = /^([1-9]|[1-2]\d|3[1])$/
    function submitForm() {
        if (numRe.exec(total)) {
            document.getElementById("total").value = (total + ".00");
            setTotal(total + ".00")
            setSubmitErr('Submit again');
            return
        }
        if (numRe.exec(monthly)) {
            document.getElementById("monthly").value = (monthly + ".00");
            setMonthly(monthly + ".00")
            setSubmitErr('Submit again');
            return
        }
        if (!dollarRe.exec(total) || !dollarRe.exec(monthly)) {
            setSubmitErr('Dollar format: ##.##');
            return
        }
        if (!dueRe.exec(due)) {
            setSubmitErr('due day must be: 1-31');
            return
        }

        SubmitDebtItem(name, debtType, total, monthly, due)
            .then(() => {
                getDebt()
                getDebtTotal();
                getMonthlyDebtTotal();
            })
            .catch((err) => {setSubmitErr(err);});

        clearForm();
    }

    function deleteDebt(name) {
        DeleteDebtItem(name);
        getDebt();
        getDebtTotal();
        getMonthlyDebtTotal();
    }

    function clearForm() {
        document.getElementById("name").value = "";
        document.getElementById("sType").value = "";
        document.getElementById("total").value = "";
        document.getElementById("monthly").value = "";
        document.getElementById("due").value = "";

        setSubmitErr('');
        setName('');
        setType('');
        setTotal('');
        setMonthly('');
        setDue('');
    }

    function onRowClick(rName, rDebtType, rTotal, rMonthly, rDue) {
        document.getElementById("name").value = rName;
        document.getElementById("sType").value = rDebtType
        document.getElementById("total").value = rTotal;
        document.getElementById("monthly").value = rMonthly;
        document.getElementById("due").value = rDue;

        setName(rName);
        setType(rDebtType);
        setTotal(rTotal);
        setMonthly(rMonthly);
        setDue(rDue);
    }

    return (
        <div>
            <div className="data-table">
                <table>
                    <thead>
                    <tr>
                        <th>Debt Name</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Monthly</th>
                        <th>Post-Payment</th>
                        <th>Payments Left</th>
                        <th>Due</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        debt.map((debtItem, index) => {
                            return (
                                <tr id={debtItem.name} key={index} onClick={()=>{
                                    onRowClick(
                                        debtItem.name,
                                        debtItem.type,
                                        debtItem.total,
                                        debtItem.monthly,
                                        debtItem.due
                                    )}}>
                                    <td>{debtItem.name}</td>
                                    <td>{debtItem.type}</td>
                                    <td>${parseFloat(debtItem.total).toLocaleString('en-US')}</td>
                                    <td>${parseFloat(debtItem.monthly).toLocaleString('en-US')}</td>
                                    <td>${(parseFloat(debtItem.total) - parseFloat(debtItem.monthly)).toLocaleString('en-US')}</td>
                                    <td>{Math.ceil(parseFloat(debtItem.total) / parseFloat(debtItem.monthly))}</td>
                                    <td style={(debtItem.due > (new Date().getDate()))? {color: "black", fontSize: "bold"} : {color: "#DDD"}}>{debtItem.due}</td>
                                    <td className="delete" onClick={()=>{deleteDebt(debtItem.name)}}><button>Delete</button></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <h3 style={{float: "left", paddingLeft: "20px", paddingRight: "10px"}}> Total: </h3><h4 style={{color: "rgb(190,0,0)", float: "left"}}>- ${debtTotal.toLocaleString('en-US')}</h4>
                <h3 style={{float: "left", paddingLeft: "20px", paddingRight: "10px"}}> Total Monthly: </h3><h4 style={{color: "rgb(190,0,0)", float: "left"}}>- ${monthlyDebtTotal.toLocaleString('en-US')}</h4>
                <h3 style={{float: "left", paddingLeft: "20px", paddingRight: "10px"}}> Total Payments Left: </h3><h4 style={{color: "rgb(190,0,0)", float: "left"}}> {Math.ceil(debtTotal/monthlyDebtTotal)}</h4>
            </div>
        <div id="input" className="input-box">
            <br />
            <div className="err">{submitErr}</div>
            <h5>Debt Name</h5>
            <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
            <h5>Debt Type</h5>
            <select id="sType" className="input" onChange={updateType} name="input">
                <option></option>
                <option value="CREDIT CARD">Credit Card</option>
                <option value="LOAN">Loan</option>
                <option value="MORGAGE">Morgage</option>
            </select>
            <h5>Total Amount</h5>
            $ <input id="total" className="input" onChange={updateTotal} autoComplete="off" name="input" type="number" min="0.01" step="0.01"/>
            <h5>Monthly Payment</h5>
            $ <input id="monthly" className="input" onChange={updateMonthly} autoComplete="off" name="input" type="number" min="0.01" step="0.01"/>
            <h5>Due Day</h5>
            <input id="due" className="input" onChange={updateDue} autoComplete="off" name="input" type="number" min="1" max="30"/>
            <br /><br />
            <button className="btn2" onClick={clearForm}>Clear</button>
            <button className="btn" onClick={submitForm}>Submit</button>
        </div>
        </div>
    )
}

export default Debt