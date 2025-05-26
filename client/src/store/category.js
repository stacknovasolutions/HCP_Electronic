import axios from "axios"
import { asyncWrap } from "./util"

export const getCategoryData = async () => {
    const [err, res] = await asyncWrap(axios.get('/gst'))
    console.log(res.data.data)

    return res.data.data
}