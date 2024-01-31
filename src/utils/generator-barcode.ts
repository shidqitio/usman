import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as bwipjs from "bwip-js";
import { generateTanggal } from "@utils/generate-time";
import { formatRupiah } from "@utils/generate-currency";
import { generateCode, generateCodeSippp, generateSptd } from "@utils/generate-code";

const generateBarcodes = async (
  reff: string,
  reffSippp: string,
  date: string
): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    // Konfigurasi barcode pertama
    const opts1 = {
      bcid: "qrcode",
      text: generateCode(reff),
      scale: 2,
      height: 20,
    };

    // Konfigurasi barcode kedua
    const kodeSippp = generateCodeSippp(reffSippp);
    console.log("kode sippp", kodeSippp);
    const dec = generateSptd(kodeSippp);
    console.log("dec", dec);

    const opts2 = {
      bcid: "qrcode",
      text: kodeSippp,
      scale: 2,
      height: 20,
    };

    bwipjs.toBuffer(opts1, function (err1, png1) {
      if (err1) {
        reject(err1);
        return;
      }

      bwipjs.toBuffer(opts2, function (err2, png2) {
        if (err2) {
          reject(err2);
          return;
        }

        const barcodeData1 = png1.toString("base64");
        const barcodeData2 = png2.toString("base64");
        resolve([barcodeData1, barcodeData2]);
      });
    });
  });
};

const createPDFWithBarcodes = async (
  reff: string,
  reffSippp: string,
  date: any,
  giro: any,
  data: any
): Promise<void> => {
  const outputPath = path.join(__dirname, "../../public/invoice/");
  // ganti nama file by kode transaksi
  const pdfPath = path.join(outputPath, `${reff}.pdf`);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>INVOICE SIPPP</title>
      <style>
        @page {
          margin: 0;
        }

        body {
          margin: 0; 
        }

        .content {
          display: flex;
          justify-content: center; 
          align-items: center; 
        }

        .text-header {
          width: 100%;
        }

        .text-tanggal {
          font-size: 12px;
        }

        .barcode-container {
          display: flex;
          justify-content: space-between; 
          align-items: center; 
          padding: 20px; 
        }

        .barcode {
          max-width: 100%; 
        }

        .payment-list {
          padding: 20px; 
        }

        .payment-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .total-line {
          border-top: 1px solid #ccc; 
          margin-bottom: 10px; 
        }

        .bold {
          font-weight: bold;
        }

        .font-blue {
          color: blue;
          font-size: 12px;
        }

        .center {
          display: flex;
          justify-content: center; 
          align-items: center;
        }

      </style>
    </head>
    <body>

      <div class="barcode-container">
        <div class="barcode">
          <img src="data:image/png;base64, BARCODE_DATA_1" />
        </div>
        <div class="barcode">
          <img src="data:image/png;base64, BARCODE_DATA_2" />
        </div>
      </div>

      <div class="center">
        <img src="../../public/image/success.png" alt="Success" width="80" height="80">
      </div>

      <div class="content">
        <h3>Transaksi Berhasil</h3>
      </div>

      <div class="content">
        <span class="text-tanggal">${generateTanggal(date)}</span>
      </div>
      
      <div class="content">
        <span class="text-tanggal">${generateCode(reff).substring(0, 10)}</span>
      </div>

      <div class="payment-list">
        <h3>Sumber Dana </h3>
        <div class="payment-item">
          <span>Nama Pengirim</span>
          <span>Universitas Terbuka</span>
        </div>
        <div class="payment-item">
          <span>Nomor Rekening</span>
          <span>${giro.nomorRekening || ""}</span>
        </div>

        <h3>Tujuan </h3>
        <div class="payment-item">
          <span>Bank Tujuan</span>
          <span>${data.namaBankVa || ""}</span>
        </div>
        <div class="payment-item">
          <span>Nama Tujuan</span>
          <span>${data.namaVa || ""}</span>
        </div>
        <div class="payment-item">
          <span>Nomor rekening</span>
          <span>${data.nomorVa || ""}</span>
        </div>

        <div class="total-line"></div>

         <div class="payment-item">
          <span>Nominal</span>
          <span>${formatRupiah(data.total) || "Rp. 0.00"}</span>
        </div>
         <div class="payment-item">
          <span>Biaya Admin</span>
          <span>Rp. 0,00</span>
        </div>
         <div class="payment-item">
          <span class="bold">Total Transfer</span>
          <span class="bold">${formatRupiah(data.total) || "Rp. 0.00"}</span>
        </div>

        <div class="total-line"></div>

        <img src="../../public/image/logo.png" alt="Logo SIPPP" width="112" height="23">
        <p class="font-blue">Dokumen elektronik ini dikeluarkan oleh SIPPP Universitas Terbuka sebagai bukti transaksi yang sah dan tidak diperlukan tanda tangan.</p>
      </div>


    </body>
    </html>
  `;

  const [barcodeData1, barcodeData2] = await generateBarcodes(
    reff,
    reffSippp,
    date
  );

  const finalHtmlContent = htmlContent
    .replace("BARCODE_DATA_1", barcodeData1)
    .replace("BARCODE_DATA_2", barcodeData2);

  const htmlFilePath = path.join(outputPath, "temp.html");
  fs.writeFileSync(htmlFilePath, finalHtmlContent);

  await page.goto(`file://${htmlFilePath}`);

  // Konversi halaman HTML menjadi PDF
  await page.pdf({
    path: pdfPath,
    width: "140mm",
    height: "220mm",
  });

  await browser.close();

  console.log(
    `PDF dengan dua gambar barcode telah dibuat dan disimpan di "${pdfPath}".`
  );
};

export { createPDFWithBarcodes };
