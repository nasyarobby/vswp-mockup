const dataOp = require("./RG_WPOP_DFT_202007141652.json").a;
const dataBd = require("./RG_WPBD_DFT_202007141632.json").a;

const mapOP = dataOp.slice(0, 20).map((row, index) => {
  return {
    npwp: dataBd[index].NPWP,
    nik: row.NIK,
    nama: row.NAMA,
    alamat: row.ALAMAT,
  };
});

const mapBd = dataBd.slice(200, 220).map((row) => {
  return {
    npwp: row.NPWP,
    nik: null,
    nama: row.NAMA,
    alamat: row.RG02_JALAN,
  };
});

const combined = [...mapOP, ...mapBd];

const withStatus = combined.map((row) => ({
  ...row,
  statusWp: row.npwp[8] % 2 == 1 ? "AKTIF" : "TIDAK AKTIF",
  statusSpt: row.npwp[10] % 2 == 0 ? "VALID" : "TIDAK VALID",
}));

require("fs").writeFile("data.json", JSON.stringify(withStatus), () => {});
