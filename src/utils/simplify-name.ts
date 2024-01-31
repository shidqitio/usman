const simplifyName = (fullName: string): string => {
  // Menghapus gelar (e.g., Prof., Dr.)
  const withoutTitle = fullName.replace(/\b\w+\.\s*/g, "");
  // Menghapus semua kata setelah nama
  const withoutAfterName = withoutTitle.replace(/,.*$/, "");
  // Menghapus gelar apa pun (e.g., S.Kom., M.Kom) sebelum nama
  const withoutDegrees = withoutAfterName.replace(/\b\w+\.\w+\.\s*/g, "");
  // Menghapus tanda koma dan spasi yang tidak perlu
  const cleanedName = withoutDegrees.replace(/,|\s+/g, " ").trim();

  return cleanedName;
};

export { simplifyName };
