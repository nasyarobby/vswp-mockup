require("dotenv").config();
const PORT = process.env.PORT || 3001;
const restify = require("restify");

const server = restify.createServer();

const cors = require("restify-cors-middleware")({
  origins: ["*"],
});

server.pre(cors.preflight);
server.use(cors.actual);

const jsend = require("jsend");
server.use(jsend.middleware);
server.use(restify.plugins.bodyParser());

const dataWp = require("./data.json");

server.post("/pajak/vswp", checkRequiredParams, function searchByKeyword(
  req,
  res,
  next
) {
  const { nik, npwp } = req.body;

  const found = nik
    ? dataWp.filter((row) => row.nik == nik)
    : dataWp.filter((row) => row.npwp == npwp);

  if (found.length > 0) {
    res.jsend.success(found[0]);
  } else {
    res.jsend.success(null);
  }
});

server.listen(PORT, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`VSWP Server running at port ${PORT}`);
});

function checkRequiredParams(req, res, next) {
  if (!req.body || (!req.body.nik && !req.body.npwp)) {
    res.jsend.fail("input parameter nik atau npwp tidak ada.");
    return next(false);
  }

  if (!req.body.tujuan) {
    res.jsend.fail("input parameter tujuan tidak ada.");
    return next(false);
  }

  next();
}
