export const random32 = () => {
  const result = Math.floor(Math.random() * Math.pow(2, 32));
  return result;
};

export const randomString = (length: number, chars: string) => {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
