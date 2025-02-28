import axios from "axios"

const URL ="http://82.29.62.125:4040"

export const login =async(user)=>{
    try {
        const response = await axios.get(`${URL}/admin`,user)	
    } catch (error) {
        
    }
}