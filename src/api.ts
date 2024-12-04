import axios from "axios";

export const fetchScan= async (req:any) => {
	const res = await axios.post('https://mrpo-backend.onrender.com/scan', req);
	return res.data;
};  