import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

import { Dependent } from '../dependent.model';
import { DependentService } from '../dependent.service';

@Component
(
	{
		selector: 'app-dependent-edit',
		templateUrl: './edit.component.html'
	}
)

export class DependentEditComponent implements AfterViewInit, OnInit
{
	public formCreate: FormGroup;
	public settings: Settings;

	public dependent: Dependent = new Dependent();
	public employeeId: string = '';

	public errorMessage: string = '';

	constructor(private router: Router, public appSettings: AppSettings, private activatedRoute: ActivatedRoute, public formBuilder: FormBuilder, private dependentService: DependentService)
	{
		this.settings = this.appSettings.settings;
		this.formCreate = this.formBuilder.group
		(
			{
				firstName: [null, Validators.compose([Validators.required])],
				lastName: [null, Validators.compose([Validators.required])],
			}
		);
	}

	ngOnInit(): void
	{
		this.activatedRoute.params.forEach
		(
			(params: Params) =>
			{
				if (params['id'] !== undefined) { this.dependent.dependentId = params['id']; }

				if (params['employeeId'] !== undefined) { this.employeeId = params['employeeId']; }
			}
		);

		this.getDetail();
	}

	getDetail()
	{
		this.dependentService
			.getByDependentId(this.dependent.dependentId)
			.subscribe
			(
				result =>
				{
					this.dependent = result;

					this.formCreate.get('firstName').setValue(this.dependent.firstName);
					this.formCreate.get('lastName').setValue(this.dependent.lastName);
				},
				error => console.error(error)
			);
	}

	public onSubmit(values: Object): void
	{
		this.errorMessage = '';

		if (this.formCreate.valid)
		{
			this.dependent.firstName = this.formCreate.value.firstName;
			this.dependent.lastName = this.formCreate.value.lastName;

			this.dependentService
				.update(this.dependent)
				.subscribe
				(
					response => this.router.navigate(['/dependent/' + this.employeeId]),
					error =>
					{
						console.error(error);
						this.errorMessage = error.error;
					}
				);
		}
	}

	cancelDetail() { this.router.navigate(['/dependent/' + this.employeeId]); }

	ngAfterViewInit() { this.settings.loadingSpinner = false; }
}
