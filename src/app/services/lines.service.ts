import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { PostMethods } from '../common/endpoints';




@Injectable({
    providedIn: 'root'
})
export class LinesService {
    private api = inject(ApiService);
    private base = environment.linesApiUrl;


}