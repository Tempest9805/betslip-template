import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService {


    private _selectedLeagues = new BehaviorSubject<any>(null);
    readonly selectedLeagues = this._selectedLeagues.asObservable();

    private _printSelectedLeagues = new BehaviorSubject<any>(null);
    readonly printSelectedLeagues = this._printSelectedLeagues.asObservable();

    private _licenceFeatures = new BehaviorSubject<any>(null);
    readonly licenceFeatures = this._licenceFeatures.asObservable();

    private _tillData = new BehaviorSubject<any>(null);
    readonly tillData = this._tillData.asObservable();

    private _taxes = new BehaviorSubject<any>(null);
    readonly taxes = this._taxes.asObservable();


    private _sessionAmount = new BehaviorSubject<number>(0);
    readonly sessionAmount = this._sessionAmount.asObservable();


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

    setPrintSelectedLeagues(request: any) {
        this._printSelectedLeagues.next(request);
    }

    SetLicenceFeatures(request: any) {
        this._licenceFeatures.next(request);
    }

    GetLicenceFeatures(): any {
        return this._licenceFeatures.value;
    }

    SetTillData(request: any) {
        this._tillData.next(request);
    }

    SetTaxes(request: any) {
        this._taxes.next(request);
    }

    GetTaxes(): any {
        return this._taxes.value;
    }

    SetSessionAmount(request: number) {
        this._sessionAmount.next(request);
    }

}