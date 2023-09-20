import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Task } from '../models';
import { QueryClientService, UseQuery, UseMutation } from '@ngneat/query';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  // dependency injection
  private queryClient = inject(QueryClientService);
  private http = inject(HttpClient);
  private useQuery = inject(UseQuery);
  private useMutation = inject(UseMutation);
  // consts
  private apiUrl = `${environment.apiUrl}/api/tasks`;
  // states
  private _tasks: Task[] = [];
  tasks: Task[] = [];

  // methods
  getAll() {
    return this.useQuery(['tasks'], () => this.http.get<Task[]>(this.apiUrl));
  }

  create() {
    return this.useMutation((title: string) => {
      return this.http
        .post<Task>(this.apiUrl, {
          title,
          completed: false,
        })
        .pipe(
          tap(() => {
            this.queryClient.invalidateQueries(['tasks']);
          })
        );
    });
  }

  delete() {
    return this.useMutation((id: string) => {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
        tap(() => {
          this.queryClient.invalidateQueries(['tasks']);
        })
      );
    });
  }

  toggle() {
    return this.useMutation((payload: Task) => {
      return this.http
        .put<{ ok: boolean }>(`${this.apiUrl}/${payload.id}`, {
          title: payload.title,
          completed: !payload.completed,
        })
        .pipe(
          tap((data) => {
            if (data.ok) {
              this.queryClient.invalidateQueries(['tasks']);
            }
          })
        );
    });
  }

  changeTitle() {
    return this.useMutation((payload: { task: Task; newtitle: string }) => {
      return this.http
        .put<boolean>(`${this.apiUrl}/${payload.task.id}`, {
          ...payload.task,
          title: payload.newtitle,
        })
        .pipe(
          tap(() => {
            this.queryClient.invalidateQueries(['tasks']);
          })
        );
    });
  }
}
