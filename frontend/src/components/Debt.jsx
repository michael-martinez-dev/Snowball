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
    const [link, setLink]           = useState('');
    const [total, setTotal]         = useState('');
    const [monthly, setMonthly]     = useState('');
    const [due, setDue]             = useState('');
    const [interest, setInterest]   = useState('');
    const [submitErr, setSubmitErr] = useState('');

    const updateName    = (e) => setName(e.target.value);
    const updateType    = (e) => setType(e.target.value);
    const updateLink    = (e) => setLink(e.target.value);
    const updateTotal   = (e) => setTotal(e.target.value);
    const updateMonthly = (e) => setMonthly(e.target.value);
    const updateDue     = (e) => setDue(e.target.value);
    const updateInterest = (e) => setInterest(e.target.value);

    let dollarRe = /^(\d+\.\d{2})$/
    let numRe = /^(\d+)$/
    let dueRe = /^([0-9]|[1-2]\d|3[1])$/
    function submitForm() {
        if (!dollarRe.exec(total) || !dollarRe.exec(monthly)) {
            setSubmitErr('Dollar format: ##.##');
            return
        }
        if (!dueRe.exec(due)) {
            setSubmitErr('due day must be: 1-31');
            return
        }

        SubmitDebtItem(name, debtType, link, total, monthly, due, interest)
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
        document.getElementById("link").value = "";
        document.getElementById("total").value = "";
        document.getElementById("monthly").value = "";
        document.getElementById("due").value = "";
        document.getElementById("interest").value = "";

        setSubmitErr('');
        setName('');
        setType('');
        setLink('');
        setTotal('');
        setMonthly('');
        setDue('');
        setInterest('');
    }

    function onRowClick(rName, rLink, rDebtType, rTotal, rInterest, rMonthly, rDue) {
        document.getElementById("name").value = rName;
        document.getElementById("link").value = rLink;
        document.getElementById("sType").value = rDebtType;
        document.getElementById("total").value = rTotal;
        document.getElementById("interest").value = rInterest;
        document.getElementById("monthly").value = rMonthly;
        document.getElementById("due").value = rDue;

        setName(rName);
        setLink(rLink);
        setType(rDebtType);
        setTotal(rTotal);
        setInterest(rInterest);
        setMonthly(rMonthly);
        setDue(rDue);
    }

    function calculateAmountLeft(totalLeft, interest, monthlyPayment) {
        let total = parseFloat(totalLeft);
        let interestRate = parseFloat(interest);
        let monthly = parseFloat(monthlyPayment);
        var amountLeft;
        console.log(interestRate);
        if (interestRate) {
            let interestAmount = total * (interestRate / 100) / 12;
            amountLeft = total + interestAmount - monthly;
        } else {
            amountLeft = total - monthly;
        }
        return amountLeft.toFixed(2).toLocaleString('en-US');
    }

    return (
        <div>
            <div className="data-table">
                <h2>My Debt</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Debt Name</th>
                        <th>Type</th>
                        <th>Total</th>
                        <th>Interest [%]</th>
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
                                        debtItem.link,
                                        debtItem.type,
                                        debtItem.total,
                                        debtItem.interest,
                                        debtItem.monthly,
                                        debtItem.due
                                    )}}>
                                    <td>{ (debtItem.link === "")? debtItem.name: <a href={debtItem.link} target="_blank">{debtItem.name}</a>}</td>
                                    <td>{debtItem.type}</td>
                                    <td>${parseFloat(debtItem.total).toLocaleString('en-US')}</td>
                                    <td>{debtItem.interest? parseFloat(debtItem.interest).toPrecision(3): "0.0"}%</td>
                                    <td>${parseFloat(debtItem.monthly).toLocaleString('en-US')}</td>
                                    <td>${calculateAmountLeft(debtItem.total, debtItem.interest, debtItem.monthly)}</td>
                                    <td>{Math.ceil(parseFloat(debtItem.total) / parseFloat(debtItem.monthly))}</td>
                                    <td style={(debtItem.due > (new Date().getDate()))? {color: "black", fontSize: "bold"} : {color: "#DDD"}}>{debtItem.due}</td>
                                    <div class="delete" className='delete' onClick={()=>{deleteDebt(debtItem.name)}}><button>Delete</button></div>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <div>
                    <h3>Notes:</h3>
                    <p>- Link is optional. You must include the "https://" in the link.</p>
                    <p>- Interest is optional. If you don't know the interest rate, leave it blank.</p>
                    <p>- Post payment is based off interest rate if supplied and uses formula: total + (total * interest / 12)</p>
                    <p>- Payments left doesn't account for interest</p>
                </div>
                <div class="totals" style={{position: "fixed", backgroundColor: "white", width: "100%", bottom: 0, height: "10%"}}>
                    <h3 style={{float: "left", paddingLeft: "20px", paddingRight: "10px"}}> Total: </h3><h4 style={{color: "rgb(190,0,0)", float: "left"}}>- ${debtTotal.toLocaleString('en-US')}</h4>
                    <h3 style={{float: "left", paddingLeft: "20px", paddingRight: "10px"}}> Total Monthly: </h3><h4 style={{color: "rgb(190,0,0)", float: "left"}}>- ${monthlyDebtTotal.toLocaleString('en-US')}</h4>
                    <h3 style={{float: "left", paddingLeft: "20px", paddingRight: "10px"}}> Total Payments Left: </h3><h4 style={{color: "rgb(190,0,0)", float: "left"}}> {Math.ceil(debtTotal/monthlyDebtTotal)}</h4>
                </div>
            </div>
        <div id="input" className="input-box">
            <br />
            <div className="err">{submitErr}</div>
            <h5>Debt Name</h5>
            <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
            <h5>Link to Pay (optional)</h5>
            <input id="link" className="input" onChange={updateLink} autoComplete="off" name="input" type="text"/>
            <h5>Debt Type</h5>
            <select id="sType" className="input" onChange={updateType} name="input">
                <option></option>
                <option value="CREDIT CARD">Credit Card</option>
                <option value="LOAN">Loan</option>
                <option value="MORGAGE">Morgage</option>
            </select>
            <h5>Total Amount</h5>
            $ <input id="total" className="input" onChange={updateTotal} autoComplete="off" name="input" type="number" min="0.00" step="1.00"/>
            <h5>Interest</h5>
            <input id="interest" className="input" onChange={updateInterest} autoComplete="off" name="input" type="number" min="0.00" step="0.01"/> %
            <h5>Monthly Payment</h5>
            $ <input id="monthly" className="input" onChange={updateMonthly} autoComplete="off" name="input" type="number" min="0.00" step="1.00"/>
            <h5>Due Day</h5>
            <input id="due" className="input" onChange={updateDue} autoComplete="off" name="input" type="number" min="0" max="30"/>
            <br /><br />
            <button className="btn2" onClick={clearForm}>Clear</button>
            <button className="btn" onClick={submitForm}>Submit</button>
        </div>
        </div>
    )
}

export default Debt