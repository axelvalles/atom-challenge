import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  }
  // dependency injection
  private tasksService = inject(TasksService);
  private cdRef = inject(ChangeDetectorRef);
  private formBuilder = inject(FormBuilder);
  // states
  formTask!: FormGroup;
  toggleMutation$ = this.tasksService.toggle();
  changeTitleMutation$ = this.tasksService.changeTitle();
  deleteMutation$ = this.tasksService.delete();
  updating = false;
  deleting = false;
  editMode = false;
  _task!: Task;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.toggleMutation$.subscribe((data) => {
      this.updating = data.isLoading;
      if (data.isLoading) {
        this.formTask.disable();
      } else {
        this.formTask.enable();
      }
    });

    this.changeTitleMutation$.subscribe((data) => {
      this.updating = data.isLoading;
      if (data.isLoading) {
        this.formTask.disable();
      } else {
        this.formTask.enable();
      }
    });

    this.deleteMutation$.subscribe((data) => {
      this.deleting = data.isLoading;
    });

    this.initForm();
  }

  // methods
  initForm() {
    this.formTask = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get errorTitle() {
    return (
      this.formTask.get('title')?.touched && this.formTask.get('title')?.invalid
    );
  }
  get errorDescription() {
    return (
      this.formTask.get('description')?.touched &&
      this.formTask.get('description')?.invalid
    );
  }

  onSubmit() {
    this.formTask.markAllAsTouched();
    if (this.formTask.invalid) return;
    const { title, description } = this.formTask.getRawValue();

    this.changeTitleMutation$
      .mutate({ title, description, task: this._task })
      .then(() => {
        this.exitEditMode();
      });
  }

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

  handleUpdate() {
    this.editMode = true;
    this.formTask.get('title')?.setValue(this._task.title);
    this.formTask.get('description')?.setValue(this._task.description);
    this.cdRef.detectChanges();
    this.inputElement.nativeElement.focus();
  }

  exitEditMode() {
    this.editMode = false;
  }
}
