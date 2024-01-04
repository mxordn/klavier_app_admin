import { HttpHeaders } from "@angular/common/http";

export function getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders()
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
    return headers
}