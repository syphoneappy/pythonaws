import axios from 'axios'

const Api = axios.create({
    baseURL: 'https://pythonaws.azurewebsites.net/',
    // baseURL:'http://localhost:8000/'
});

export default Api