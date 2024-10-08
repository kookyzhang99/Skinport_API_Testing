"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_1 = __importStar(require("./util/users"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.get('/api/items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request1 = yield axios_1.default.get('https://api.skinport.com/v1/items', {
            params: { app_id: '730', currency: 'EUR', tradable: true }
        });
        const request2 = yield axios_1.default.get('https://api.skinport.com/v1/items', {
            params: { app_id: '730', currency: 'EUR', tradable: false }
        });
        request1.data.map((item_t) => {
            users_1.csItems[item_t.market_hash_name] = { minPrice_nt: item_t.min_price, minPrice_t: 0 };
        });
        request2.data.map((item_nt) => {
            users_1.csItems[item_nt.market_hash_name].minPrice_t = item_nt.min_price;
        });
        res.json(users_1.csItems);
    }
    catch (err) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}));
app.post('/api/purchase', (req, res) => {
    const { username, itemPrice } = req.body;
    if (!users_1.default[username]) {
        res.status(404).json({ error: "user not found!" });
    }
    if (users_1.default[username].balance < itemPrice) {
        res.status(400).json({ error: 'Insufficient balance' });
    }
    users_1.default[username].balance -= itemPrice;
    res.json({
        message: 'purchase success!',
        balance: users_1.default[username].balance
    });
});
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
