const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return formattedResponse(401, {message: 'Incorrect httpMethod'});
    }

    const body = event?.body ?? '{"email": ""}';

    const eventBody = JSON.parse(event?.body);
    const userEmail = eventBody?.email
    if (!userEmail) {
        return formattedResponse(400, {status: error, message: "Invalid request! Email required."})
    } 
    
    return await updateUser(event)
}

async function updateUser(event) {
    let _data;
    let { email, deposits, balance, profit, withdrawals, activePackage } = JSON.parse(event.body); 
    
    const query = `UPDATE users 
    SET
        total_deposit = $1, 
        balance = $2, 
        profit = $3,
        withdrawals = $4,
        active_package = $5
    WHERE email = $6
    `;
    const values = [deposits, balance, profit, withdrawals, activePackage, email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'PUT',
            status: 'success',
            message: 'User data update successful',
            body: {rows, fields}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'PUT',
            status: 'error',
            message: 'Error updating user data',
            error: error.message
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}