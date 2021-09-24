import axios from "axios";
import * as XLSX from "xlsx";
import { ExcelObject } from "../@types";

class FileHelper {
  extractData = async (fileUrl: string): Promise<ExcelObject[]> => {
    const download = await axios({
      method: "get",
      url: fileUrl,
      responseType: "arraybuffer",
    });
    const workbook = XLSX.read(download.data, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonResult: ExcelObject[] = XLSX.utils.sheet_to_json(worksheet);
    return jsonResult;
  };
}

export default FileHelper;
