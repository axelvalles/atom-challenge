import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // dependency injection
  private tasksServices = inject(TasksService);
  private themeServices = inject(ThemeService);
  private formBuilder = inject(FormBuilder);

  // states
  themeInput = new FormControl('');
  createMutation$ = this.tasksServices.create();
  formTask!: FormGroup;

  ngOnInit(): void {
    this.createMutation$.subscribe((data) => {
      if (data.isLoading) {
        this.formTask.disable();
      }else{
        this.formTask.enable();
      }
    });

    if (this.themeServices.theme === 'dark') {
      this.themeInput.setValue('true');
    }

    this.themeInput.valueChanges.subscribe(() => {
      this.themeServices.toggleTheme();
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

    this.createMutation$.mutate({ title, description }).then(() => {
      this.formTask.reset();
    });
  }
}
