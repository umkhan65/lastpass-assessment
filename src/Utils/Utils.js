export const fetchEncryptedPassword = async (email, password) => {
  let encryptedPassword = "q";
  await window.crypto.subtle
    .importKey(
      "raw", //only "raw" is allowed
      new TextEncoder().encode(password), //your password
      {
        name: "PBKDF2",
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
    )
    .then(async function (importKey) {
      //derive key
      await window.crypto.subtle
        .deriveKey(
          {
            name: "PBKDF2",
            salt: new TextEncoder().encode(email),
            iterations: 1000,
            hash: { name: "SHA-1" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          importKey, //your key from generateKey or importKey
          {
            //the key type you want to create based on the derived bits
            name: "AES-GCM", //can be any AES algorithm ("AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC")
            //the generateKey parameters for that type of algorithm
            length: 128, //can be  128, 192, or 256
          },
          true, //whether the derived key is extractable (i.e. can be used in exportKey)
          ["encrypt", "decrypt"] //limited to the options in that algorithm's importKey
        )
        .then(async function (cryptoKey) {
          //export key
          await window.crypto.subtle
            .exportKey("jwk", cryptoKey)
            .then(function (keyData) {
              encryptedPassword = keyData.k;
            })
            .catch(function (err) {
              console.error(err);
            });
        })
        .catch(function (err) {
          console.error(err);
        });
    })
    .catch(function (err) {
      console.error(err);
    });

  return encryptedPassword;
};
