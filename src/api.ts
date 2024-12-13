import axios from "axios";

export const fetchScan= async (req:{tgId:string, eventId:string}) => {
	const res = await axios.post('https://mrpo-backend.onrender.com/scan', req);
	return res.data;
};  

export const fetchGetEvents= async () => {
	const res = await axios.get('https://mrpo-backend.onrender.com/events');
	return res.data;
};  