import chai = require("chai");
import chaiHttp = require("chai-http");

import { testFilter } from "../src/index";

chai.use(chaiHttp);

const app = async () => {
  await testFilter({
    body: {
      fileUrl:
        "https://storage.googleapis.com/csv2json-b3nl3w/x_space_mass_upload.xlsx",
      sellerShopId: "dc158855-80bb-4384-bf7b-f4c478a2b0aa",
      backendSuccessUrl: "http://localhost:3000/product",
      productJobId: "f5e287b5-664e-40ed-8114-7a62be6d633b",
      backendFailUrl: "http://localhost:3000/product-job",
    },
  });
  return true;
};

app()
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
