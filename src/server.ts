import express, { Request, Response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import users, { csItems } from './util/users';

const app = express();
const port: number = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded())

app.get('/api/items', async (req: Request, res:Response) => {
    try{
        const request1 = await axios.get('https://api.skinport.com/v1/items', {
            params: { app_id: '730', currency: 'EUR', tradable: true }
        })
        const request2 = await axios.get('https://api.skinport.com/v1/items', {
            params: { app_id: '730', currency: 'EUR', tradable: false }
        })

        request1.data.map((item_t: any) => {
            csItems[item_t.market_hash_name] = {minPrice_nt: item_t.min_price, minPrice_t: 0}
        });
        request2.data.map((item_nt: any) => {
            csItems[item_nt.market_hash_name].minPrice_t = item_nt.min_price
        })

        res.json(csItems);
    } catch(err) {
        res.status(500).json({
            error:'Internal Server Error'
        })
    }
})

app.post('/api/purchase', (req: Request, res: Response) => {
    const {username, itemPrice} : {username: string, itemPrice: number} = req.body;
    
    if(!users[username]){
        res.status(404).json({error: "user not found!"});
    }
    
    if(users[username].balance < itemPrice) {
        res.status(400).json({ error: 'Insufficient balance'});
    }
    
    users[username].balance -= itemPrice;

    res.json({
        message:'purchase success!',
        balance: users[username].balance
    })
})

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})