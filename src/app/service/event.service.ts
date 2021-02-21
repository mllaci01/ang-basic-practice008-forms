import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Event } from '../model/event';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  apiUrl: string = `http://localhost:3000/list`;

  list$: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  /*private list: Event[] = [
    {
      id: 1,
      name: 'Angular Connect',
      date: '9/9/2036',
      time: '10:00 am',
      location: { address: '1 London Rd', city: 'London', country: 'England' }
    },
    {
      id: 2,
      name: 'ng-nl',
      date: '4/12/2037',
      time: '09:00 am',
      location: { address: '127 DT ', city: 'Amsterdam', country: 'NL' }
    },
    {
      id: 3,
      name: 'ng-conf 2037',
      date: '4/12/2037',
      time: '09:00 am',
      location: { address: 'The Palatial America Hotel', city: 'Salt Lake City', country: 'USA' }
    },
    {
      id: 4,
      name: 'UN Angular Summit',
      date: '6/10/2037',
      time: '08:00 am',
      location: { address: 'The UN Angular Center', city: 'New York', country: 'USA' }
    },
  ];*/

  getAll(): void {
    this.list$.next([]);
    this.http.get<Event[]>(this.apiUrl).subscribe(
      products => this.list$.next(products)
    );
  }

  get(id: number | string): Observable<Event> {
    id = parseInt(('' + id), 10);
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
    }


    update(event: Event): Observable<Event> {
      return this.http.patch<Event>(
        `${this.apiUrl}/${event.id}`,
        event
      ).pipe(
        tap( () => {
          this.getAll();
          this.toastr.info('The event has been updated.', 'UPDATED');
        })
      );
    }

    create(event: Event): void {
      this.http.post<Event>(
        `${this.apiUrl}`,
        event
      ).subscribe(
        () => this.getAll()
      );
      this.toastr.success('The event has been created.', 'NEW EVENT');
    }

    remove(event: Event): void {
      this.http.delete<Event>(
        `${this.apiUrl}/${event.id}`
      ).subscribe(
        () => this.getAll()
      );
      this.toastr.warning('The event has been deleted.', 'DELETED');
    }

  }
