import axios from 'axios';
import { useMemo } from 'react';

const Useaxios = () => {
    const axiosInstance = useMemo(() => {
        return axios.create({
            baseURL: 'https://food-ordering-system-server-five.vercel.app'
           

        })
    }, [])
    return axiosInstance;
};

export default Useaxios;