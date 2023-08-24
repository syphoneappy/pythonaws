import axios from 'axios'

const Api = axios.create({
    baseURL: 'https://pythonaws.azurewebsites.net/',
});

export default Api