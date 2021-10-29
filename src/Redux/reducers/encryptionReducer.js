const initState = {
  email: null,
  importKey: null,
  cryptoKey: null,
  encryptedPassword: null,
  encryptionIV: new Uint8Array(12),
  encryptedData: null,
  decryptedData: null,
};

const encryptionReducer = (state = initState, action) => {
  switch (action.type) {
    case "DERIVE_KEY":
      return {
        ...state,
        importKey: action.payload.importKey,
        cryptoKey: action.payload.cryptoKey,
        encryptedPassword: action.payload.encryptedPassword,
        email: action.payload.email,
      };

    case "ENCRYPT_DATA":
      return {
        ...state,
        encryptedData: action.payload.encryptedData,
        decryptedData: action.payload.decryptedData,
      };
    case "DECRYPT_DATA":
      return {
        ...state,
        decryptedData: action.payload.decryptedData,
      };
    default:
      return { ...state };
  }
};

export default encryptionReducer;
