import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';

const app = express();
const secretKey = "flowerwine";
const userInfo = {
    id: 1,
    nickname: "flowerwine"
}

class Result {
    static OK = 200;
    static UNAUTHORIZED = 401;

    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

function sign(info, key) {
    return crypto.createHmac("sha256", key).update(info).digest("hex");
}

function jwt(info, key) {
    const header = btoa(JSON.stringify({alg: "HS256", typ: "JWT"}));
    const payload = btoa(JSON.stringify(info));
    const signature = sign(JSON.stringify(info), key);
    return `${header}.${payload}.${signature}`;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:63342");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    if (username === "admin" && password === "123456") {
        const token = jwt(userInfo, secretKey);
        res.json(new Result(Result.OK, "登录成功", {token: token}));
    } else {
        res.json(new Result(Result.UNAUTHORIZED, "用户名或密码错误"));
    }
});

app.get("/follow", (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.json(new Result(Result.UNAUTHORIZED, "没有提供token"));
    }
    let tokenSplit = token.split(".");
    const payload = atob(tokenSplit[1]);
    const signature = tokenSplit[2];
    if (signature !== sign(payload, secretKey)) {
        return res.json(new Result(Result.UNAUTHORIZED, "token无效"))
    }
    const info = JSON.parse(payload);
    if (info.id !== userInfo.id) {
        return res.json(new Result(Result.UNAUTHORIZED, "没有权限"));
    }
    res.json(new Result(Result.OK, "获取关注信息", {
        follow: 3,
        fan: 0,
    }));
});

app.listen(9090, () => {
    console.log('Server is running on port 9090');
});

