import axios from "axios";

export const fetchScan= async (req:any) => {
	const res = await axios.post('http://localhost:4444/scan', req);
	return res.data;
};  