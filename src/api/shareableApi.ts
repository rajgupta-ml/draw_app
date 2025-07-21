import type { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "./common";
import { Axis3D } from "lucide-react";

export const QUERY = {
    getShapeData :  async ({ queryKey }: QueryFunctionContext<[string, string | null]>) => {
        const [_key, shapeId] = queryKey;
        console.log(shapeId);
        if (!shapeId) throw new Error("Shape ID is missing");
      
        const response = await axios.get(`${BASE_URL}/get-shape-data?id=${shapeId}`);
        return response.data;
      }
}


export const MUTATE = {
  postShapeData : async(data : {id : string, json : string}) => {
    const response = await axios.post(`${BASE_URL}/generate-share-link`, data);
    return response.data
  },
  createRoom : async(data :{id : string, name : string}) => {
    const response = await axios.post(`${BASE_URL}/create-room`, data);
    return response.data
  }
}