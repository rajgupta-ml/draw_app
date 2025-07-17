import type { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./common";

export const QUERY = {
    getShapeData :  async ({ queryKey }: QueryFunctionContext<[string, string | null]>) => {
        const [_key, shapeId] = queryKey;
      
        if (!shapeId) throw new Error("Shape ID is missing");
      
        const response = await axios.get(`${BASE_URL}/get-shape-data?id=${shapeId}`);
        return response.data;
      }
}


export const MUTATE = {
  postShapeData : async(data : {id : string, json : string}) => {
    const response = await axios.post(`${BASE_URL}/generate-share-link`, data);
    return response.data
  }
}