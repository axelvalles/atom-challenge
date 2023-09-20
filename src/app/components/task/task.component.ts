import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Task } from 'src/app/models';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  // props
  @Input()
  set task(task: Task) {
    this._task = task;
    this.input.setValue(this._task.title);
  }
  // dependency injection
  private tasksService = inject(TasksService);
  private cdRef = inject(ChangeDetectorRef);
  // states
  toggleMutation$ = this.tasksService.toggle();
  changeTitleMutation$ = this.tasksService.changeTitle();
  deleteMutation$ = this.tasksService.delete();
  updating = false;
  deleting = false;
  _task!: Task;
  editMode = false;
  input = new FormControl('', { nonNullable: true });
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.toggleMutation$.subscribe((data) => {
      this.updating = data.isLoading;
      if (data.isLoading) {
        this.input.disable();
      } else {
        this.input.enable();
      }
    });

    this.changeTitleMutation$.subscribe((data) => {
      this.updating = data.isLoading;
      if (data.isLoading) {
        this.input.disable();
      } else {
        this.input.enable();
      }
    });

    this.deleteMutation$.subscribe((data) => {
      console.log(data);

      this.deleting = data.isLoading;
    });
  }

  // methods
  handleCheck() {
    this.toggleMutation$.mutate(this._task).then((res) => {
      console.log(res);
    });
  }

  handleRemove() {
    this.deleteMutation$.mutate(this._task.id).then((res) => {
      console.log(res);
    });
  }

  handleDoubleClick() {
    this.editMode = true;
    this.cdRef.detectChanges();
    this.inputElement.nativeElement.focus();
  }

  handleEdit(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.changeTitle();
    }

    if (e.key === 'Escape') {
      this.exitEditMode();
    }
  }

  changeTitle() {
    const title = this.input.value.trim();

    if (title === '') return;

    this.changeTitleMutation$
      .mutate({ newtitle: title, task: this._task })
      .then(() => {
        this.exitEditMode();
      });
  }

  exitEditMode() {
    this.editMode = false;
  }
}
