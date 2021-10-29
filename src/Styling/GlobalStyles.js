import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
*{
    margin:0;
    padding:0;
}
body{
    font-family: 'Open Sans',sans-serif;
    width:100%;
}
h2{
    font-size: 3rem;
    font-weight: lighter;
    color: #333;
}
h3{
    font-size: 1.3rem;
    color: #333;
    padding: 1.5rem;
    text-transform: capitalize;
}
p{
    font-size: 1rem;
    line-height: 200%;
    color: #696969;
}
a{
    text-decoration: none;
    color:#333;
}
img{
    display:block;
}
input{
    font-weight: bold;
    font-family: 'Montserrat',sans-serif;
}
.mui-textfield{
    label{
        font-family:"Open Sans",sans-serif;
        font-weight: 400;
        font-size:0.9rem;
    }
}
.mui-button{
    margin-top: 5rem;
    border-radius: 4rem;
}
textarea{
    font-family:"Open Sans",sans-serif;
        font-weight: 400;
        font-size:0.9rem;
}
`;

export default GlobalStyles;
