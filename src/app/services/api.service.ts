import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService {


    private _selectedLeagues = new BehaviorSubject<any>(null);
    readonly selectedLeagues = this._selectedLeagues.asObservable();



    constructor(private http: HttpClient) { }

    apiPostMethod(url: string, body: any): Observable<any> {
        return this.http.post<any>(url, body);
    }

    apiGetMethod(url: string): Observable<any> {
        return this.http.get<any>(url);
    }

    apiGetMethodWithParams(url: string, paramsObj: { [key: string]: string | number }): Observable<any> {
        let params = new HttpParams({ fromObject: paramsObj as any });

        return this.http.get<any>(url, { params });
    }

    SetSelectedLeagues(request: any) {
        this._selectedLeagues.next(request);
    }


}