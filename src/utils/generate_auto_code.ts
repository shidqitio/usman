import CustomError from "@middleware/error-handler";

const generateKodeAplikasi = async (
    kodeApp:string) => {
    try {
        let kode_aplikasi : any = "00"

        if(kodeApp !== null) {
            kode_aplikasi = kodeApp
        }

        let kode1 : any = parseInt(kode_aplikasi.charAt(0));
        let kode2 : any = parseInt(kode_aplikasi.charAt(1));

        if(kode1 > 0) {
            if(kode2 === 9) {
                kode1 = parseInt(kode1) + 1;
                kode2 = 0
                kode_aplikasi = kode1.toString() + kode2.toString()
            }
            else {
                kode_aplikasi = parseInt(kode_aplikasi) + 1;
            }
        }

        if(kode1 === 0) {
            if (kode2 === 9) {
              kode1 = parseInt(kode1) + 1;
              kode2 = 0;
              kode_aplikasi = kode1.toString() + kode2.toString();
            } 
            else {
              kode_aplikasi = kode1.toString() + String(parseInt(kode2) + 1);
            }
        }

        if (kodeApp === null) {
            kode_aplikasi = "00";
          }

        return kode_aplikasi
    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const generateKodeGroup = async (
    exGroup:any,
    kodeAplikasi:any) => {
    try {
        let kode_group;
        let max = 0;
    
        if (exGroup.length > 0) {
        const result : any = [];
        exGroup.forEach((list : any) => {
            const kode : any = list.kode_group;
            const n : any = kode.split(".").pop();
            result.push(parseInt(n));
        });
    
        max = result.reduce(function (a : any, b : any) {
            return Math.max(a, b);
        }, -Infinity);
        }
    
        const init = "G";
        const app = kodeAplikasi;
        const urut = max + 1;
        kode_group = init + app + "." + urut;
    
        return kode_group;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

  
//   exports.generateKodeGroup = (exGroup : any, kodeAplikasi : any) => {
//     let kode_group;
//     let max = 0;
  
//     if (exGroup.length > 0) {
//       const result : any = [];
//       exGroup.forEach((list : any) => {
//         const kode : any = list.kode_group;
//         const n : any = kode.split(".").pop();
//         result.push(parseInt(n));
//       });
  
//       max = result.reduce(function (a : any, b : any) {
//         return Math.max(a, b);
//       }, -Infinity);
//     }
  
//     const init = "G";
//     const app = kodeAplikasi;
//     const urut = max + 1;
//     kode_group = init + app + "." + urut;
  
//     return kode_group;
//   };
  
//   exports.generateMenu1 = (kode : any, kodeAplikasi : any) => {
//     const init = "M";
//     const app = kodeAplikasi;
//     const m1 = "01";
//     let urut = String(kode + 1);
  
//     if (urut.length === 1) {
//       urut = "0" + String(kode + 1);
//     }
  
//     const kode_menu1 = init + app + "." + m1 + "." + urut;
  
//     return kode_menu1
//   }

export default {
    generateKodeAplikasi,
    generateKodeGroup
}