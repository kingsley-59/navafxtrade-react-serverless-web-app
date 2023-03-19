const db = require('./modules/database');
const formattedResponse = require('./modules/formattedResponse');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'GET') {
        return formattedResponse(401, {message: 'Incorrect httpMethod'});
    }

    const userEmail = event.queryStringParameters?.userEmail
    if (userEmail) {
        return await getOneInfo(userEmail);
    } else {
        return await getAllInfo();
    }

}

async function getAllInfo() {
    let _data;
    const query = `SELECT * FROM withdrawal_info ORDER BY date_added DESC`;
    const values = []
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'Users successfully retrieved database',
            body: {rows}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'GET',
            status: 'error',
            message: 'Error getting all users from database',
            body: `${error?.code ?? null} ${error.message}`
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}

async function getOneInfo(email) {
    let _data;
    const query = `SELECT * FROM withdrawal_info WHERE email=$1`;
    const values = [email]
    try {
        const { rows, fields } = await db.query(query, values);
        _data = {
            reqest: 'GET',
            status: 'success',
            message: 'User successfully retrieved database',
            body: {rows: rows[0]}
        }
        return formattedResponse(200, _data);
    } catch (error) {
        _data = {
            reqest: 'GET',
            status: 'error',
            message: 'Error getting all users from database',
            body: `${error?.code ?? null} ${error.message}`
        }
        console.log(error.message);
        return formattedResponse(500, _data);
    }
}