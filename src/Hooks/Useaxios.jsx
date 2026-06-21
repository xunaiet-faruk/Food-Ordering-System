import axios from 'axios';
import { useMemo } from 'react';

const Useaxios = () => {
    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:3000'
           

        })
    }, [])
    return axiosInstance;
};

export default Useaxios;