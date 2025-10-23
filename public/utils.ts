import type { RecType } from "../lib/types";
import { HOST } from "./js/constants";

export async function postToServer(route: string, data: RecType){
  if (route.startsWith('/')){ route = route.substring(1, route.length)}
  return await fetch(HOST+route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());
}