import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const PAGE_SIZE = 10;

const usePagination = (url, urlParamsPara = {}) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [successCount, setSuccessCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(PAGE_SIZE);
    const [urlParams, setUrlParams] = useState(urlParamsPara)

    const fetchData = useCallback(
        async (pageNo, params) => {
            setLoading(true);
            try {
                const response = await axios({
                    url,
                    params: {
                        ...urlParams,
                        ...params,
                        pageNo,
                        pageSize: perPage,
                    },
                });
                setUrlParams(params);
                setData(response.data.data);
                setTotal(response.data.total);
                setSuccessCount(response.data.successfulCount)
                setLoading(false);
            } catch (error) {
                console.error('Error => ', error);
                setLoading(false);
            }
        },
        [url, perPage]
    );

    const gotoPage = (pageNo, pageSize) => {
        setCurrentPage(pageNo);
        fetchData(pageNo, { ...urlParams, pageSize });
    };

    useEffect(() => {
        fetchData(currentPage, { pageNo: currentPage, pageSize: perPage, ...urlParams });
    }, [fetchData, perPage]);

    const pages = Array.from(
        { length: Math.ceil(total / perPage) },
        (v, i) => i + 1
    );

    return {
        data,
        gotoPage,
        currentPage,
        pages,
        total,
        successCount,
        loading,
        fetchData,
        setPerPage,
        perPage
    };
};

export { usePagination };
