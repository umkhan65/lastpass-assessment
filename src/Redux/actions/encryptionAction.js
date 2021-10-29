export const deriveKeyAction = (email, password) => async (dispatch) => {
  //import key
  window.crypto.subtle
    .importKey(
      "raw", //only "raw" is allowed
      new TextEncoder().encode(password), //your password
      {
        name: "PBKDF2",
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
    )
    .then(function (importKey) {
      //derive key
      window.crypto.subtle
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
        .then(function (cryptoKey) {
          //export key
          window.crypto.subtle
            .exportKey("jwk", cryptoKey)
            .then(function (keyData) {
              dispatch({
                type: "DERIVE_KEY",
                payload: {
                  importKey: importKey,
                  cryptoKey: cryptoKey,
                  encryptedPassword: keyData.k,
                  email: email,
                },
              });
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
};

export const encryptDataAction =
  (encryptionIV, cryptoKey, data, email) => async (dispatch) => {
    //encrypt
    console.log(cryptoKey, "EncryptionDataActionCryptoKey");
    window.crypto.subtle
      .encrypt(
        {
          name: "AES-GCM",
          iv: encryptionIV,
          additionalData: new TextEncoder().encode(email),
          tagLength: 128,
        },
        cryptoKey,
        new TextEncoder().encode(data)
      )
      .then(function (encrypted) {
        //returns an ArrayBuffer containing the encrypted data
        // const encryptedString = new TextDecoder().decode(encrypted);
        //decrypt
        console.log(encrypted);
        window.crypto.subtle
          .decrypt(
            {
              name: "AES-GCM",
              iv: encryptionIV,
              additionalData: new TextEncoder().encode(email),
              tagLength: 128,
            },
            cryptoKey,
            encrypted
          )
          .then(function (decrypted) {
            //returns an ArrayBuffer containing the decrypted data
            var decryptedString = new TextDecoder().decode(
              new Uint8Array(decrypted)
            );
            dispatch({
              type: "ENCRYPT_DATA",
              payload: {
                encryptedData: encrypted,
                decryptedData: decryptedString,
              },
            });
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  };

export const decryptDataAction =
  (encryptionIV, cryptoKey, encryptedData, email) => async (dispatch) => {
    console.log(encryptedData, "encryptedData");

    window.crypto.subtle
      .decrypt(
        {
          name: "AES-GCM",
          iv: encryptionIV,
          additionalData: new TextEncoder().encode(email),
          tagLength: 128,
        },
        cryptoKey,
        encryptedData
      )
      .then(function (decrypted) {
        //returns an ArrayBuffer containing the decrypted data
        var decryptedString = new TextDecoder().decode(
          new Uint8Array(decrypted)
        );
        dispatch({
          type: "DECRYPT_DATA",
          payload: {
            decryptedData: decryptedString,
          },
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  };
