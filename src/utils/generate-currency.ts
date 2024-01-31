const formatRupiah = (angka: number): string => {
  const reverse = angka.toString().split("").reverse().join("");
  const ribuan = reverse.match(/\d{1,3}/g);
  if (ribuan === null) {
    return "Rp. 0";
  }
  const formattedRupiah =
    "Rp. " + ribuan.join(".").split("").reverse().join("");
  return formattedRupiah;
};

export { formatRupiah };
