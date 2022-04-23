
const db = require('./src/database');
const { 
    createTransaction, 
    getAllTransactions, 
    getOneTransaction, 
    updateTransaction, 
    removeTransaction } = require('./src/transactions');
const formattedResponse = require('./src/utils/formattedResponse');

exports.handler = async function(event, context) {
    console.log("Called!")
    
    switch (event.httpMethod) {
        case 'GET':
            let userEmail = event?.queryStringParameters?.userEmail
            if (userEmail) {
                return await getOneTransaction(userEmail)
            } else {
                return await getAllTransactions()
            }
            break;
        case 'POST':
            return await createTransaction(event);
            break;
        case 'PUT':
            const eventBody = event?.body ?? '{"email": ""}';
            const _eventBody = JSON.parse(eventBody);
            const email = _eventBody?.email ?? null;
            if (!email ) return formattedResponse(400, {status: error, message: "Invalid request! Email required."})
            return await updateTransaction(event);
            break;
        case 'DELETE':
            if (!email ) return formattedResponse(400, {status: error, message: "Invalid request! Email required."})
            return await removeTransaction(email);
            break;
        default:
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Could not get http request details'}, null, 2)
            }
            break;
    }

    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({message: 'Working.'})
    // }
}
