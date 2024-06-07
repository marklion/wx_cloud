const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const { default: axios } = require("axios");
const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

app.post('/api/run_api', async (req, res) => {
  const { url, method, data } = req.body;
  let ret = {
    err_msg:"无权限",
  };
  let sk = process.env.SHARE_KEY;
  if (sk == req.headers['share-key']) {
    try {
      const result = await axios({
        method,
        url,
        data
      });
      ret.data = result.data;
      ret.err_msg = "";
    } catch (error) {
      console.log(error);
      ret.err_msg = JSON.stringify(error);
    }
  }
  res.send(ret);
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
