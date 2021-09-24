import { Request, Response } from "express";
import axios from "axios";
import { ExcelObject, Product } from "./@types";
import FileHelper from "./helpers/file";
import ProductHelper from "./helpers/product";

export const testFilter = async (input: any) => {
  const {
    fileUrl,
    sellerShopId,
    backendSuccessUrl,
    productJobId,
    backendFailUrl,
  } = input.body;

  try {
    const fileHelper = new FileHelper();
    const data: ExcelObject[] = await fileHelper.extractData(fileUrl);
    const productHelper = new ProductHelper(data, sellerShopId);
    const products: Product[] = await productHelper.arrangeDataIntoProducts();

    console.log(`products: `, products);
    const returnObject = {
      products,
      productJobId,
    };
    await axios({
      method: "post",
      url: backendSuccessUrl,
      data: returnObject,
    });
  } catch (err) {
    console.error(err);
    await axios({
      method: "put",
      url: backendFailUrl,
      data: productJobId,
    });
  }
};

export const filterExcel = async (req: Request, res: Response) => {
  const {
    fileUrl,
    sellerShopId,
    backendSuccessUrl,
    productJobId,
    backendFailUrl,
  } = req.body;

  try {
    const fileHelper = new FileHelper();
    const data: ExcelObject[] = await fileHelper.extractData(fileUrl);
    const productHelper = new ProductHelper(data, sellerShopId);
    const products: Product[] = await productHelper.arrangeDataIntoProducts();

    const returnObject = {
      products,
      productJobId,
    };
    // Post product to backend to create products
    await axios({
      method: "post",
      url: backendSuccessUrl,
      data: returnObject,
    });
  } catch (err) {
    console.error(err);
    await axios({
      method: "put",
      url: backendFailUrl,
      data: productJobId,
    });
  }
};
