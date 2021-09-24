import { camelCase, filter, groupBy, isUndefined, map, trim } from "lodash";
import {
  ExcelObject,
  Image,
  Product,
  ProductVariant,
  ProductVariantOptions,
} from "../@types";

class ProductHelper {
  public data: ExcelObject[];
  public sellerShopId: string;

  constructor(input: ExcelObject[], sellerShopId: string) {
    this.data = input;
    this.sellerShopId = sellerShopId;
  }

  arrangeDataIntoProducts = async (): Promise<Product[]> => {
    // Init products array
    const products: Product[] = [];

    // Change keys naming to camel case to be accessible
    const properKey = map(this.data, (a) => {
      for (const [key, value] of Object.entries(a)) {
        delete Object.assign(a, { [camelCase(key)]: a[key] })[key];
      }
      return a;
    });

    // Process products with no variants
    const noVariants = filter(properKey, (pkObject) => {
      return isUndefined(pkObject.variationIntegrationNo);
    });
    await Promise.all(
      map(noVariants, (noVariant) => {
        const noVariantsProduct: Product = {
          name: noVariant?.productName || "",
          description: noVariant?.productDescription || "",
          code: noVariant?.parentSku || null,
          coverImage: noVariant?.coverImage || null,
          images: [],
          variants: [
            {
              name: noVariant?.productName || "",
              sku: noVariant?.parentSku || null,
              weight: noVariant?.weight || 0,
              options: [],
              price: noVariant?.price || 0,
              image: noVariant?.variationImage || null,
              stockOnHand: noVariant?.stock,
              sellerShopId: this.sellerShopId,
            },
          ],
          sellerShopId: this.sellerShopId,
        };
        products.push(noVariantsProduct);
      })
    );

    // Process products with variants
    const grouped = groupBy(properKey, "variationIntegrationNo");
    for (const [key, value] of Object.entries(grouped)) {
      if (key !== "undefined") {
        const variants = await Promise.all(
          map(value, (excelObject) => {
            const name: string =
              excelObject?.productName +
              " " +
              excelObject?.variation1Option +
              " " +
              (excelObject?.variation2Option || "");
            const sku: string = excelObject?.sku;
            const weight: number = excelObject?.weight;
            const price: number = excelObject?.price;
            const image: string = excelObject?.variationImage;
            const stockOnHand: number = excelObject?.stock;
            const options: ProductVariantOptions[] = [
              {
                name: excelObject?.variation1Name,
                value: excelObject?.variation1Option,
              },
              {
                name: excelObject?.variation2Name,
                value: excelObject?.variation2Option,
              },
            ];
            const productVariant: ProductVariant = {
              name: trim(name),
              sku,
              weight,
              options,
              price,
              image,
              stockOnHand,
              sellerShopId: this.sellerShopId,
            };
            return productVariant;
          })
        );
        const productName: string = value[0]?.productName || "";
        const description: string = value[0]?.productDescription || "";
        const code: string = value[0]?.parentSku || null;
        const coverImage: string = value[0]?.coverImage || null;
        const images: Image[] = [];
        const product: Product = {
          name: productName,
          description,
          code,
          coverImage,
          images,
          variants,
          sellerShopId: this.sellerShopId,
        };
        products.push(product);
      }
    }

    return products;
  };
}

export default ProductHelper;
