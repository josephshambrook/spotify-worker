export function base64Encode(buf: ArrayBuffer) {
  let string = "";
  new Uint8Array(buf).forEach((byte) => {
    string += String.fromCharCode(byte);
  });
  return btoa(string);
}

export function base64Decode(string: string) {
  string = atob(string);
  const length = string.length,
    buf = new ArrayBuffer(length),
    bufView = new Uint8Array(buf);
  for (var i = 0; i < length; i++) {
    bufView[i] = string.charCodeAt(i);
  }
  return buf;
}
