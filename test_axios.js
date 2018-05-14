const axios = require("axios");

const  article =  { id: 3, lang: 'Python', webFramework: 'Flask' }

axios.post("http://localhost:3000/programming", article)
  .then(response => console.log(response.data))
  .catch(error => console.log(error));

axios.get("http://localhost:3000/programming")
  .then(response => console.log(response.data))
  .catch(error => console.log(error));

