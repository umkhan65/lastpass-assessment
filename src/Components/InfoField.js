import { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  encryptDataAction,
  decryptDataAction,
} from "../Redux/actions/encryptionAction";
import { Auth as AuthConstants } from "../Constants";
import { Storage } from "react-jhipster";
import { Button } from "@material-ui/core";

const InfoField = () => {
  const [data, setData] = useState("");
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const { email, encryptionIV, encryptedData, decryptedData, cryptoKey } =
    useSelector((state) => state.encryption);
  useEffect(() => {
    //TODO: check if localStorage has any encrypted data
    let existingStorage = Storage.local.get(AuthConstants.USER_DATA);
    if (existingStorage) {
      let found = existingStorage.filter((data) => data.email === email);
      if (found && found.length > 0) {
        if (found[0].data) {
          console.log(cryptoKey, "EncryptionDataActionCryptoKey");
          let binary_string = window.atob(found[0].data);
          let len1 = binary_string.length;
          let bytes1 = new Uint8Array(len1);
          for (let i = 0; i < len1; i++) {
            bytes1[i] = binary_string.charCodeAt(i);
          }
          let encrypted1 = bytes1.buffer;
          dispatch(
            decryptDataAction(encryptionIV, cryptoKey, encrypted1, email)
          );
        }
      }
    }
  }, [dispatch, cryptoKey, encryptionIV, email]);
  useEffect(() => {
    if (decryptedData) {
      setData(decryptedData);
    }
  }, [decryptedData]);

  useEffect(() => {
    if (data !== "" && data) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [disabled, data]);

  useEffect(() => {
    if (encryptedData) {
      let existingStorage = Storage.local.get(AuthConstants.USER_DATA);
      if (existingStorage) {
        let found = existingStorage.filter((data) => data.email === email);
        if (found && found.length > 0) {
          let binary = "";
          let bytes = new Uint8Array(encryptedData);
          var len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const encryptedString = window.btoa(binary);
          const tempStorage = existingStorage.map((item) =>
            item.email === email ? { ...item, data: encryptedString } : item
          );
          Storage.local.set(AuthConstants.USER_DATA, tempStorage);
        }
      }
    }
  }, [encryptedData, email]);

  const onSaveHandler = () => {
    if (data !== "" && data) {
      dispatch(encryptDataAction(encryptionIV, cryptoKey, data, email));
    }
  };

  const signOutHandler = () => {
    window.location.reload(false);
  };

  return (
    <InfoContainer>
      <textarea value={data} onChange={(e) => setData(e.target.value)} />

      <Button
        className="save-button"
        onClick={onSaveHandler}
        disabled={disabled}
      >
        Save
      </Button>
      <Button className="signout-button" onClick={signOutHandler}>
        Sign Out
      </Button>
    </InfoContainer>
  );
};

const InfoContainer = styled.div`
  max-width: 30rem;
  height: 30vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 40px;
  border-radius: 0.6rem;
  border: 1px solid rgb(245, 247, 248);
  box-shadow: rgb(0 0 0 / 25%) 0px 2px 4px 0px;
  margin-top: 10rem;

  textarea {
    resize: none;
    height: 15rem;
    padding: 0.2rem;
  }
  Button {
    margin-top: 2rem;
    border-radius: 2rem;
    opacity: 1;
    font-family: "Open Sans", sans-serif;
    font-size: 1rem;
    font-weight: 700;
    height: 3rem;
    text-align: center;
    color: white;
  }
  .save-button {
    background-color: rgb(0, 116, 183);
    :hover {
      opacity: 0.9;
      background-color: rgb(0, 116, 183);
    }
    :disabled {
      color: white;
      opacity: 0.5;
    }
  }
  .signout-button {
    margin-top: 1rem;
    background-color: rgba(210, 45, 39);
    :hover {
      opacity: 0.9;
      background-color: rgba(210, 45, 39);
    }
  }
`;
export default InfoField;
